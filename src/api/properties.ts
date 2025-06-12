import { $api } from "./BaseUrl";
import type { Property, CreateProperty } from "@/lib/types";
export const fetchProperties = async (
  filter?: "active" | "sold_rented" | "inactive",
  isVerified?: boolean,
): Promise<Property[]> => {
  const params: any = {};
  if (filter) params.filter = filter;
  if (isVerified !== undefined) params.isVerified = isVerified;

  const response = await $api.get<Property[]>("/api/properties", { params });
  return response.data;
};

export async function createProperty(property: CreateProperty) {
  const response = await $api.post("/api/properties", property);
  return response.data;
}

export const updateProperty = async (
  propertyId: string,
  propertyData: CreateProperty,
) => {
  const response = await $api.patch(
    `/api/properties/${propertyId}`,
    propertyData,
  );
  return response.data;
};

export const deleteProperty = async (propertyId: string) => {
  const response = await $api.delete(`/api/properties/${propertyId}`);
  return response.data;
};

// GET property by ID
export const fetchPropertyById = async (
  propertyId: string,
): Promise<Property> => {
  const response = await $api.get<Property>(`/api/properties/${propertyId}`);
  return response.data;
};
