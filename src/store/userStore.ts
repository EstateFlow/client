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
import { create } from 'zustand'

export interface User {
  id: string
  email: string
  role: 'renter_buyer' | 'private_seller' | 'agency' | 'moderator' | 'admin'
  is_email_verified: boolean
  paypal_credentials: string | null
  created_at: string
  updated_at: string
}

interface UserStore {
  users: User[]
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: async () => {
    const res = await fetch('http://localhost:3001/api/users')
    const data = await res.json()
    set({ users: data })
  },
}))
