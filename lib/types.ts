export interface Dictionary<T> {
  [key: string]: T;
}

export enum AuthLevel {
  None = 0,
  Normal = 1,
  Admin = 2,
}

export type User = {
  id: number;
  email: string;
  password: string;
  authLevel: AuthLevel;
  wishlist: number[];
};

export type ShopItem = {
  id: number;
  name: string;
  price: number;
  type: ItemType;
};

export enum ItemType {
  Duck = 0,
  CustomDuck = 1,
  DuckColor = 2,
  DuckHead = 3,
  DuckBody = 4,
}

export type Purchase = {
  id: number;
  userId: number;
  date: number;
  entries: PurchaseEntry[];
  shippingPrice: number;
  address: PaymentAddress;
};

export type PurchaseEntry = {
  item: ShopItem | CustomDuck;
  count: number;
};

export type CustomDuck = {
  id: 0;
  color: ShopItem;
  head: ShopItem;
  body: ShopItem;
};

export type CustomDuckPartsCatalog = {
  colors: ShopItem[];
  heads: ShopItem[];
  bodies: ShopItem[];
};

export type CreditCardDetails = {
  number: string;
  expirationYear: number;
  expirationMonth: number;
  name: string;
  code: number;
};

export type UserEvent = {
  id: number;
  date: number;
  userId: number;
  eventType: number;
  details: string[];
};
