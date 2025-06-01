import { create } from 'zustand';
import type { Property, PropertyWishlist } from '@/lib/types';

type TempStore = {
  tempWishlist?: PropertyWishlist;
  tempProperty?: Property;
  setTempWishlist: (w: PropertyWishlist) => void;
  setTempProperty: (p: Property) => void;
};

export const useTempStore = create<TempStore>((set) => ({
  tempWishlist: undefined,
  tempProperty: undefined,
  setTempWishlist: (w) => set({ tempWishlist: w }),
  setTempProperty: (p) => set({ tempProperty: p }),
}));
