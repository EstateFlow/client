import { create } from "zustand";
import type { AxiosError } from "axios";
import { $api } from "@/api/BaseUrl";

export type UserRole =
  | "renter_buyer"
  | "private_seller"
  | "agency"
  | "moderator"
  | "admin";

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  paypalCredentials?: string;
}

interface UserState {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateProfile: (data: {
    username: string;
    avatarUrl?: string;
    bio?: string;
    paypalCredentials?: string;
  }) => Promise<void>;
  requestEmailChange: (newEmail: string) => Promise<void>;
  confirmEmailChange: (token: string) => Promise<void>;
  requestPasswordChange: (newPassword: string) => Promise<void>;
  confirmPasswordChange: (token: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: CurrentUser | null) => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const res = await $api.get(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: res.data, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Failed to fetch user";
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data.message || "An unexpected error occurred";
      } else if (axiosError.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await $api.patch(`${API_URL}/api/user`, data);
      if (response.status === 200) {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              ...data,
              updatedAt: response.data.updatedAt,
            },
            isLoading: false,
          });
        } else {
          set({ isLoading: false, error: "No user found" });
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Profile update failed";
      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 401) {
          errorMessage = "Unauthorized. Please log in again.";
        } else if (status === 400) {
          errorMessage =
            axiosError.response.data.message || "Invalid data provided";
        } else {
          errorMessage =
            axiosError.response.data.message || "An unexpected error occurred";
        }
      } else if (axiosError.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  requestEmailChange: async (newEmail) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      await $api.post(`${API_URL}/api/user/request-email-change`, { newEmail });
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Failed to request email change";
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data.message || "An unexpected error occurred";
      } else if (axiosError.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  confirmEmailChange: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.get(
        `${API_URL}/api/user/confirm-change/${token}/email`,
      );
      const currentUser = get().user;
      if (currentUser) {
        set({
          user: { ...currentUser, email: response.data.email },
          isLoading: false,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Failed to confirm email change";
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data.message || "Invalid or expired token";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  requestPasswordChange: async (newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }
      await $api.post(`${API_URL}/api/user/request-password-change`, {
        newPassword,
      });
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Failed to request password change";
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data.message || "An unexpected error occurred";
      } else if (axiosError.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  confirmPasswordChange: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await $api.get(`${API_URL}/api/user/confirm-change/${token}/password`);
      set({ isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Failed to confirm password change";
      if (axiosError.response) {
        errorMessage =
          axiosError.response.data.message || "Invalid or expired token";
      }
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user) => {
    set({ user });
  },
}));
