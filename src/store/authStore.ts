import { create } from "zustand";
import type { AxiosError } from "axios";
import { $api } from "@/api/BaseUrl";

type User = { email: string; role: string } | null;

interface AuthStore {
  user: User;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (code: string, role?: string) => Promise<{ message: string }>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.post(`${API_URL}/api/auth/register`, data);
      set({ isLoading: false });
      if (response.status === 201) {
        set({ user: { email: data.email, role: data.role } });
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

      set({ isLoading: false, error: errorMessage });
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
        set({ user: userRes.data, isLoading: false, isAuthenticated: true });
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

      set({ isLoading: false, error: errorMessage });
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
      const { accessToken, refreshToken, isNewUser, user, message } =
        response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      set({ user, isLoading: false, isAuthenticated: true });
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

      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      const userRes = await $api.get(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: userRes.data, isLoading: false, isAuthenticated: true });
    } catch (error) {
      set({ isLoading: false, error: "Token invalid or expired" });
      get().logout();
    }
  },
  logout: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
  clearError: () => {
    set({ error: null });
  },
}));
