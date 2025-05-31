import { create } from "zustand";
import {
  fetchProperties,
  createProperty,
  deleteProperty,
  fetchPropertyById,
  updateProperty
} from "@/api/properties";
import type { Property, CreateProperty } from "@/lib/types";

interface PropertiesState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  selectedProperty: Property | null;
  filter: "active" | "sold_rented" | "inactive" | null;
  isVerified: boolean | null; // <--- добавлено

  update: (propertyId: string, updatedData: CreateProperty) => Promise<void>;
  fetchChouse: (filter?: "active" | "sold_rented" | "inactive", isVerified?: boolean) => Promise<void>;
  fetchMultiple: (filters: ("active" | "sold_rented" | "inactive")[], isVerified?: boolean) => Promise<void>;
  create: (propertyData: CreateProperty) => Promise<void>;
  remove: (propertyId: string) => Promise<void>;
  fetchById: (propertyId: string) => Promise<void>;
}

export const usePropertiesStore = create<PropertiesState>((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  filter: null,
  selectedProperty: null,
  isVerified: null,
  update: async (propertyId, updatedData) => {
  set({ loading: true, error: null });
  try {
    await updateProperty(propertyId, updatedData);
    await get().fetchChouse(get().filter || undefined);
  } catch (error: any) {
    set({ error: error?.response?.data?.message || "Failed to update property" });
  } finally {
    set({ loading: false });
  }
},
  
    
  fetchChouse: async (filter) => {
    set({ loading: true, error: null, filter });
    try {
      const data = await fetchProperties(filter);
      set({ properties: data });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to load properties",
      });
    } finally {
      set({ loading: false });
    }
  },
fetchMultiple: async (filters, isVerified) => {
  set({ loading: true, error: null });
  try {
    const results = await Promise.all(filters.map((f) => fetchProperties(f, isVerified)));
    const merged = results.flat();
    set({ properties: merged });
  } catch (error: any) {
    set({
      error: error?.response?.data?.message || "Failed to load properties",
    });
  } finally {
    set({ loading: false });
  }
},
  create: async (propertyData) => {
    set({ loading: true, error: null });
    try {
      await createProperty(propertyData);
      await get().fetchChouse(get().filter || undefined);
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to create property",
      });
    } finally {
      set({ loading: false });
    }
  },
  
  remove: async (propertyId) => {
    set({ loading: true, error: null });
    try {
      await deleteProperty(propertyId);
      // Удаляем локально без запроса
      set((state) => ({
        properties: state.properties.filter((p) => p.id !== propertyId),
      }));
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to delete property",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchById: async (propertyId) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPropertyById(propertyId);
      set({ selectedProperty: data });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || "Failed to load property",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
