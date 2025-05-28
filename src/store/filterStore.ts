// src/store/filterStore.ts
import { create } from "zustand";

interface FilterState {
  price: [number, number];
  area: [number, number];
  rooms: number[];
  setPrice: (range: [number, number]) => void;
  setArea: (range: [number, number]) => void;
  toggleRoom: (room: number) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  price: [0, 100000],
  area: [0, 200],
  rooms: [],
  setPrice: (range) => set({ price: range }),
  setArea: (range) => set({ area: range }),
  toggleRoom: (room) =>
    set((state) => ({
      rooms: state.rooms.includes(room)
        ? state.rooms.filter((r) => r !== room)
        : [...state.rooms, room],
    })),
}));
