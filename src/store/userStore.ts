// import type { User } from "@/types/UserTypes";
// import { create } from "zustand";

// const userStore = create((set) => ({
//   usersCount: 0,
//   increaseUsers: () =>
//     set((state: User) => ({
//       usersCount: state.usersCount + 1,
//     })),
// }));

// export default userStore;

// src/stores/userStore.ts
// import { create } from 'zustand'

// export interface User {
//   id: string
//   email: string
//   role: 'renter_buyer' | 'private_seller' | 'agency' | 'moderator' | 'admin'
//   is_email_verified: boolean
//   paypal_credentials: string | null
//   created_at: string
//   updated_at: string
// }

// interface UserStore {
//   users: User[]
//   fetchUsers: () => Promise<void>
// }

// export const useUserStore = create<UserStore>((set) => ({
//   users: [],
//   fetchUsers: async () => {
//     const res = await fetch('http://localhost:3001/api/users')
//     const data = await res.json()
//     set({ users: data })
//   },
// }))
// stores/userStore.ts
import { create } from 'zustand';
import { getAuthToken } from '@/utils/auth';

export interface CurrentUser {
  userId: string;
  email: string;
  username: string;
  role: 'renter_buyer' | 'private_seller' | 'agency' | 'moderator' | 'admin';
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
      const res = await fetch('https://server-rbdb.onrender.com/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        console.error('Не удалось получить пользователя');
        return;
      }

      const data = await res.json();
      set({ user: data });
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
    }
  },
}));
