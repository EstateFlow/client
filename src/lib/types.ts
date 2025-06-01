export interface UserInfo {
  email: string;
  isEmailVerified: boolean;
  role: string;
  avatarUrl: string;
  userId: string;
  bio: string;
  username: string;
  listingLimit: number; // если используешь
  createdAt: string;
  updatedAt: string;
  paypalCredentials?: string;
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
export type CreatePropertyImage = {
  imageUrl: string;
  isPrimary: boolean;
};

export type CreateProperty = {
  ownerId: string;
  title: string;
  description: string;
  propertyType: "house" | "apartment" | string;
  transactionType: "sale" | "rent" | string;
  price: string;
  currency: string;
  size: string;
  rooms: number;
  address: string;
  status: "active" | "inactive" | "sold" | "rented";
  documentUrl: string;
  verificationComments: string;
  facilities: string;
  images: CreatePropertyImage[]; // ✅ Используем другой тип
};

export type UpdateProperty = Partial<CreateProperty> & {
  isVerified?: boolean;
};

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

export const FACILITY_OPTIONS = [
  "Heating",
  "Air conditioning / Conditioner",
  "Hot water",
  "Gas supply",
  "Wi-Fi",
  "Cable TV",
  "Smart TV",
  "Intercom",
  "Security system",
  "Fridge",
  "Freezer",
  "Washing machine",
  "Dryer",
  "Dishwasher",
  "Microwave",
  "Oven",
  "Stove / Cooktop",
  "Double bed",
  "Single bed",
  "Sofa",
  "Dining table",
  "Wardrobe",
  "Desk",
  "Chairs",
  "Shower",
  "Bathtub",
  "Toilet",
  "Heated towel rail",
  "Pets allowed",
  "Balcony",
  "Terrace",
  "Elevator",
  "Parking",
  "Garage",
  "Storage room",
  "Wheelchair accessible",
  "Smoking allowed",
];
