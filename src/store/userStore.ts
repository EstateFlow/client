import { create } from "zustand";
import { getAuthToken } from "@/utils/auth";

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
  role: "renter_buyer" | "private_seller" | "agency" | "moderator" | "admin";
  isEmailVerified: boolean;
}

interface UserState {
  user: CurrentUser | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Не удалось получить пользователя");
        return;
      }

      const data = await res.json();
      set({ user: data });
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
    }
  },
}));
