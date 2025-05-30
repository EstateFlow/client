import { create } from "zustand";
import type { AxiosError } from "axios";
import { $api } from "@/api/BaseUrl";
import { useUserStore, type UserRole } from "./userStore";

interface AuthStore {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  register: (data: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (code: string, role?: string) => Promise<{ message: string }>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.post(`${API_URL}/api/auth/register`, data);
      set({ isLoading: false });
      if (response.status === 201) {
        useUserStore.getState().setUser({
          userId: "temp-id",
          email: data.email,
          username: data.username,
          role: data.role,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        set({ isAuthenticated: true, isInitialized: true });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Registration failed";

      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 409) {
          errorMessage = "User with this email already exists";
        } else if (status === 500) {
          errorMessage = "Internal server error. Please try again later.";
        } else {
          errorMessage =
            axiosError.response.data.message || "An unexpected error occurred";
        }
      } else if (axiosError.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      set({ isLoading: false, error: errorMessage, isInitialized: true });
      throw new Error(errorMessage);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await $api.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const userRes = await $api.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        useUserStore.getState().setUser(userRes.data);
        set({ isLoading: false, isAuthenticated: true, isInitialized: true });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Login failed";

      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 401:
            errorMessage = "Incorrect password";
            break;
          case 403:
            errorMessage = "Email not verified. Please verify your email.";
            break;
          case 404:
            errorMessage = "User with this email does not exist";
            break;
          default:
            errorMessage =
              axiosError.response.data.message ||
              "An unexpected error occurred";
        }
      } else if (axiosError.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      set({ isLoading: false, error: errorMessage, isInitialized: true });
      throw new Error(errorMessage);
    }
  },

  googleLogin: async (code: string, role?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.post(`${API_URL}/api/auth/google`, {
        code,
        role,
      });
      const { accessToken, refreshToken, isNewUser, message } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const userRes = await $api.get(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      useUserStore.getState().setUser(userRes.data);
      set({ isLoading: false, isAuthenticated: true, isInitialized: true });
      return {
        message: isNewUser ? "User created and logged in via Google" : message,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = "Google login failed";

      if (axiosError.response) {
        const status = axiosError.response.status;
        if (status === 400) {
          errorMessage =
            axiosError.response.data.message ||
            "Invalid request. Please try again.";
        } else if (status === 500) {
          errorMessage = "Internal server error. Please try again later.";
        } else {
          errorMessage =
            axiosError.response.data.message || "An unexpected error occurred";
        }
      } else if (axiosError.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      set({ isLoading: false, error: errorMessage, isInitialized: true });
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, isInitialized: true });
        return;
      }
      await useUserStore.getState().fetchUser();
      set({ isLoading: false, isAuthenticated: true, isInitialized: true });
    } catch (error) {
      set({ isLoading: false, error: "Token invalid or expired" });
      get().logout();
    }
  },

  logout: () => {
    localStorage.clear();
    useUserStore.getState().setUser(null);
    useUserStore.getState().clearError();
    set({ isAuthenticated: false, isInitialized: true });
  },

  clearError: () => {
    set({ error: null });
  },
}));
