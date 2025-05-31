import { create } from "zustand";

const ALL_TYPES = ["sale", "rent"] as const;
const ALL_ROOMS = [1, 2, 3, 4, 5] as const;

export interface FilterState {
  price: [number, number];
  area: [number, number];
  types: string[];
  rooms: number[];
  searchQuery: string;
  sortBy: string;

  setPrice: (range: [number, number]) => void;
  setArea: (range: [number, number]) => void;
  toggleType: (type: string) => void;
  toggleRoom: (room: number) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  /* ---------- состояние по умолчанию ---------- */
  price: [0, 0],
  area: [0, 0],
  types: [...ALL_TYPES],
  rooms: [...ALL_ROOMS],
  searchQuery: "",
  sortBy: "newest",

  /* ---------- методы ---------- */
  setPrice: (range) => set({ price: range }),
  setArea: (range) => set({ area: range }),

  toggleType: (type) =>
    set((state) => {
      const isSelected = state.types.includes(type);

      // не даём снять последнюю галочку
      if (isSelected && state.types.length === 1) return state;

      return {
        types: isSelected
          ? state.types.filter((t) => t !== type)
          : [...state.types, type],
      };
    }),

  toggleRoom: (room) =>
    set((state) => {
      const isSelected = state.rooms.includes(room);

      if (isSelected && state.rooms.length === 1) return state;

      return {
        rooms: isSelected
          ? state.rooms.filter((r) => r !== room)
          : [...state.rooms, room],
      };
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () => {
    const currentState = get();
    set({
      price: [0, currentState.price[1] || 0],
      area: [0, currentState.area[1] || 0],
      types: [...ALL_TYPES],
      rooms: [...ALL_ROOMS],
      searchQuery: "",
      sortBy: "newest",
    });
  },
}));
