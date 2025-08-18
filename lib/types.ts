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
  DuckColor = 1,
  DuckHead = 2,
  DuckBody = 3,
}

export type CustomDuck = {
  color: number;
  head: number;
  body: number;
};

export type Purchase = {
  userId: number;
  date: Date;
  details: {};
};
