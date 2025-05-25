import { create } from "zustand";

type User = { email: string } | null;

interface AuthStore {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.clear();
    set({ user: null });
    window.location.href = "/login";
  }
}));