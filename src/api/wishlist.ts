import { $api } from './BaseUrl';

export const fetchWishlist = (token: string) => {
  return $api.get("/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addToWishlist = (propertyId: string, token: string) => {
  return $api.post(
    "/api/wishlist",
    { propertyId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const removeFromWishlist = (propertyId: string, token: string) => {
  return $api.delete(`/api/wishlist/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
