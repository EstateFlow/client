import API from "./BaseUrl";

export const fetchWishlist = () => API.get('/api/wishlist');

export const addToWishlist = (propertyId: string) =>
  API.post('/api/wishlist', { propertyId });

export const removeFromWishlist = (propertyId: string) =>
  API.delete(`/api/wishlist/${propertyId}`);