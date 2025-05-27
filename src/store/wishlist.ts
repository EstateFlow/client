// src/store/wishlist.ts
import { create } from 'zustand';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '@/api/wishlist';
import type { PropertyWishlist } from "@/lib/types";    

interface WishlistStore {
  wishlist: PropertyWishlist[];
  loading: boolean;
  error: string | null;
  loadWishlist: () => Promise<void>;
  addProperty: (propertyId: string) => Promise<void>;
  removeProperty: (propertyId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  loadWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await fetchWishlist();
      set({ wishlist: data });
    } catch (err: any) {
      // Если 401, не пытайся повторно
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
    try {
      await addToWishlist(propertyId);
      await useWishlistStore.getState().loadWishlist();
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Ошибка добавления в вишлист' });
    }
  },

  removeProperty: async (propertyId: string) => {
    try {
      await removeFromWishlist(propertyId);
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.id !== propertyId),
      }));
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Ошибка удаления из вишлиста' });
    }
  },
}));
