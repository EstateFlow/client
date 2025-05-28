// src/store/wishlist.ts
import { create } from 'zustand';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '@/api/wishlist';
import type { PropertyWishlist } from "@/lib/types";
import { useAuthStore } from './authStore';

interface WishlistStore {
  wishlist: PropertyWishlist[];
  loading: boolean;
  error: string | null;
  loadWishlist: () => Promise<void>;
  addProperty: (propertyId: string) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  loadWishlist: async () => {
    const token = localStorage.getItem('accessToken'); // можно и через useAuthStore.getState().isAuthenticated, но так проще

    if (!token) {
      set({ error: "Вы не авторизованы" });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await fetchWishlist(token);
      set({ wishlist: data });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        set({ error: "Вы не авторизованы" });
        return;
      }
      set({ error: err?.response?.data?.message || 'Ошибка загрузки вишлиста' });
    } finally {
      set({ loading: false });
    }
  },

  addProperty: async (propertyId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ error: "Вы не авторизованы" });
      return;
    }

    try {
      await addToWishlist(propertyId, token);
      await get().loadWishlist(); // обновим список
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Ошибка добавления в вишлист' });
    }
  },

  removeProperty: async (propertyId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ error: "Вы не авторизованы" });
      return;
    }

    try {
      await removeFromWishlist(propertyId, token);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.id !== propertyId),
      }));
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Ошибка удаления из вишлиста' });
    }
  },
}));
