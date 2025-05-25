export interface UserInfo {
  email: string;
  isEmailVerified: boolean;
  role: string;
  userId: string;
  username: string;
}


export interface Offer {
  id: string;
  address: string;
  type: string;
  price: number;
  imageUrl: string;
}
