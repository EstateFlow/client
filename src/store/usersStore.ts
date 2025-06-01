import { create } from "zustand";
import axios from "axios";
import { $api } from "@/api/BaseUrl";

interface User {
  id: string;
  username: string;
  email: string;
  role: "renter_buyer" | "private_seller" | "agency" | "moderator" | "admin";
  isEmailVerified: boolean;
  paypalCredentials?: string;
  listingLimit?: number;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

interface UsersState {
  isLoading: boolean;
  error: string | null;
  users: User[];
  fetchAllUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addUser: (user: any) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  isLoading: false,
  error: null,
  users: [],

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/user/all`,
      );
      set({ users: response.data, isLoading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to fetch users"
        : "An unexpected error occurred";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteUser: async (userId: string) => {
    set({ error: null });
    try {
      await $api.delete(`${import.meta.env.VITE_API_URL}/api/user/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },

  addUser: async (user) => {
    set({ error: null });
    try {
      const response = await $api.post(
        `${import.meta.env.VITE_API_URL}/api/user`,
        {
          newUserInfo: {
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            bio: user.bio,
            avatarUrl:
              "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
          },
        },
      );
      set((state) => ({
        users: [
          ...state.users,
          {
            ...response.data,
            isEmailVerified: true,
          },
        ],
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to add user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },

  updateUser: async (user: User) => {
    set({ error: null });
    try {
      console.log(user);
      const response = await $api.patch(
        `${import.meta.env.VITE_API_URL}/api/user/${user.id}`,
        { updatedInfo: user },
      );
      set((state) => ({
        users: state.users.map((u) =>
          u.id === user.id ? { ...response.data } : u,
        ),
      }));
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update user"
        : "An unexpected error occurred";
      set({ error: errorMessage });
    }
  },
}));
