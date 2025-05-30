import { create } from "zustand";

interface User {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  avatarUrl: string;
  bio: string;
  username: string;
  listingLimit: number;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    status: string;
    endDate?: string;
  };
}

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface SubscriptionState {
  user: User | null;
  subscription: Subscription | null;
  isExpanded: boolean;
  setUser: (user: User) => void;
  setSubscription: (subscription: Subscription) => void;
  toggleExpanded: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  user: null,
  subscription: null,
  isExpanded: false,
  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
