"use server";

import sqlite from "better-sqlite3";

const db = await openDb();

// Open SQLite database connection
async function openDb() {
  const options = {
    fileMustExist: true,
    // verbose: console.log
  };
  return sqlite("./database.sqlite3", options);
}

// Authentication
export enum AuthLevel {
  None = 0,
  Normal = 1,
  Admin = 2,
}

export type User = {
  email: string;
  password: string;
  authLevel: AuthLevel;
};

export async function addUser(
  email: string,
  hashedPassword: string,
  authLevel: number,
) {
  const insertUser = db.prepare(
    "INSERT INTO Users (email, password, authLevel) VALUES (?, ?, ?) RETURNING *",
  );

  return insertUser.get(email, hashedPassword, authLevel) as User;
}

export async function getUser(email: string) {
  const getUser = db.prepare("SELECT * FROM Users WHERE email = ?");
  const user = getUser.get(email) as User;

  return user;
}

export enum ItemType {
  Duck = 0,
  DuckColor = 1,
  DuckHead = 2,
  DuckBody = 3,
}

// Shop items
export type ShopItem = {
  id: number;
  name: string;
  price: number;
  type: ItemType;
};

export async function getShopItem(id: number) {
  const getShopItem = db.prepare("SELECT * FROM Items WHERE id = ?");
  const shopItem = getShopItem.get(id) as ShopItem;

  return shopItem;
}

export async function getCatalog() {
  const getCatalog = db.prepare(
    `SELECT * FROM Items WHERE type = ${ItemType.Duck}`,
  );
  const catalog = getCatalog.all() as ShopItem[];

  return catalog;
}

export async function addShopItem(
  name: string,
  price: number,
  type: ItemType,
  image: File,
) {
  const addShopItem = db.prepare(
    "INSERT INTO Items (name, price, type) VALUES (?, ?, ?) RETURNING *",
  );

  const item = addShopItem.get(name, price, type) as ShopItem;

  // TODO: Save the image
  console.log(item);
  console.log(image);

  return item;
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
