export interface UserInfo {
  email: string;
  isEmailVerified: boolean;
  role: string;
  avatarUrl: string
  userId: string;
  bio: string
  username: string;
  listingLimit: number; // если используешь
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface PropertyView {
  id: string;
  propertyId: string;
  viewedAt: string;
}

export interface PropertyPriceHistory {
  id: string;
  propertyId: string;
  price: string;
  currency: string;
  effectiveDate: string;
}

export interface PropertyOwner {
  id: string;
  username: string;
  email: string;
  role: "renter_buyer" | "agent" | "admin";
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  facilities: string;
  propertyType: string;
  transactionType: string;
  price: string;
  currency: string;
  size: string;
  rooms: number;
  address: string;
  status: "active" | "sold" | "rented" | "inactive";
  documentUrl: string;
  verificationComments: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  views: PropertyView[];
  pricingHistory: PropertyPriceHistory[];
  owner: PropertyOwner;
  isWished: boolean;
}

export interface PropertyWishlist {
  id: string;
  ownerId: string;
  isVerified: boolean;
  title: string;
  description: string;
  facilities: string;
  propertyType: string;
  transactionType: string;
  price: number;
  currency: string;
  size: number;
  rooms: number;
  address: string;
  status: "active" | "sold" | "rented" | "inactive";
  documentUrl: string;
  verificationComments: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
}
