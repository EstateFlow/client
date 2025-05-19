export interface UserInfo {
  name: string;
  status: string;
  email: string;
  paypal: string;
  offerLimit: string;
  registrationDate: string;
  lastUpdate: string;
  about: string;
}

export interface Offer {
  id: string;
  address: string;
  type: string;
  price: number;
  imageUrl: string;
}
