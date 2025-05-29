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

  update: (propertyId: string, updatedData: CreateProperty) => Promise<void>;
  fetchAll: (filter?: "active" | "sold_rented" | "inactive") => Promise<void>;
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
  update: async (propertyId, updatedData) => {
  set({ loading: true, error: null });
  try {
    await updateProperty(propertyId, updatedData);
    await get().fetchAll(get().filter || undefined);
  } catch (error: any) {
    set({ error: error?.response?.data?.message || "Failed to update property" });
  } finally {
    set({ loading: false });
  }
},

    
  fetchAll: async (filter) => {
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

  create: async (propertyData) => {
    set({ loading: true, error: null });
    try {
      await createProperty(propertyData);
      await get().fetchAll(get().filter || undefined);
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
