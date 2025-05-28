import {$api} from "./BaseUrl";
import type { Property } from "@/lib/types";

export const fetchProperties = async (
  filter?: "active" | "sold_rented" | "inactive"
): Promise<Property[]> => {
  const params = filter ? { filter } : {};
  const response = await $api.get<Property[]>("/api/properties", { params });
  return response.data;
};

export const createProperty = async (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "isVerified" | "views" | "pricingHistory" | "owner" | "isWished">) => {
  const response = await $api.post("/api/properties", propertyData);
  return response.data;
};

export const deleteProperty = async (propertyId: string) => {
  const response = await $api.delete(`/api/properties/${propertyId}`);
  return response.data;
};

// GET property by ID
export const fetchPropertyById = async (propertyId: string): Promise<Property> => {
  const response = await $api.get<Property>(`/api/properties/${propertyId}`);
  return response.data;
};

