import type { User } from "@/types/UserTypes";
import { create } from "zustand";

const userStore = create((set) => ({
  usersCount: 0,
  increaseUsers: () =>
    set((state: User) => ({
      usersCount: state.usersCount + 1,
    })),
}));

export default userStore;
