import { create } from "zustand";
import axios from "axios";
import { $api } from "@/api/BaseUrl";

interface TotalSalesData {
  totalSales: number;
  totalAmount: string;
}

interface TopViewedProperty {
  id: string;
  title: string;
  price: string;
  address: string;
  view_count: number;
}

interface NewUsersData {
  new_buyers: number;
  new_sellers: number;
  new_agencies: number;
}

interface PropertyViewsData {
  propertyId: string;
  views: number;
}

interface StatisticsState {
  totalSales: TotalSalesData | null;
  topViewedProperties: TopViewedProperty[];
  newUsers: NewUsersData | null;
  propertyViews: PropertyViewsData | null;
  loading: boolean;
  propertyViewsLoading: boolean;
  error: string;
  setTotalSales: (data: TotalSalesData | null) => void;
  setTopViewedProperties: (data: TopViewedProperty[]) => void;
  setNewUsers: (data: NewUsersData | null) => void;
  setPropertyViews: (data: PropertyViewsData | null) => void;
  setLoading: (loading: boolean) => void;
  setPropertyViewsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  fetchTotalSales: (startDate: string, endDate: string) => Promise<void>;
  fetchTopViewedProperties: (
    startDate: string,
    endDate: string,
  ) => Promise<void>;
  fetchNewUsers: (startDate: string, endDate: string) => Promise<void>;
  fetchPropertyViews: (
    propertyId: string,
    startDate: string,
    endDate: string,
  ) => Promise<void>;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  totalSales: null,
  topViewedProperties: [],
  newUsers: null,
  propertyViews: null,
  loading: false,
  propertyViewsLoading: false,
  error: "",
  setTotalSales: (data) => set({ totalSales: data }),
  setTopViewedProperties: (data) => set({ topViewedProperties: data }),
  setNewUsers: (data) => set({ newUsers: data }),
  setPropertyViews: (data) => set({ propertyViews: data }),
  setLoading: (loading) => set({ loading }),
  setPropertyViewsLoading: (loading) => set({ propertyViewsLoading: loading }),
  setError: (error) => set({ error }),
  fetchTotalSales: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/stats/total-sales`,
        {
          params: { startDate, endDate },
        },
      );
      set({ totalSales: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch total sales",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchTopViewedProperties: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/stats/top-viewed`,
        {
          params: { startDate, endDate, limit: 5 },
        },
      );
      set({ topViewedProperties: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch top viewed properties",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchNewUsers: async (startDate, endDate) => {
    set({ loading: true, error: "" });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/stats/new-users`,
        {
          params: { startDate, endDate },
        },
      );
      set({ newUsers: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch new users",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchPropertyViews: async (propertyId, startDate, endDate) => {
    if (!propertyId) return;
    set({ propertyViewsLoading: true, error: "" });
    try {
      const response = await $api.get(
        `${import.meta.env.VITE_API_URL}/api/stats/property-views/${propertyId}`,
        {
          params: { startDate, endDate },
        },
      );
      set({ propertyViews: response.data });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.message
          : "Failed to fetch property views",
      });
    } finally {
      set({ propertyViewsLoading: false });
    }
  },
}));
