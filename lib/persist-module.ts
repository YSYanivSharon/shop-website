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
  None,
  Normal,
  Admin,
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
    "INSERT INTO Users (email, password, authLevel) VALUES (?, ?, ?)",
  );
  insertUser.run(email, hashedPassword, authLevel);

  return getUser(email);
}

export async function getUser(email: string) {
  const getUser = db.prepare("SELECT * FROM Users WHERE email = ?");
  const user = getUser.get(email) as User;

  return user;
}

// Shop items
export type ShopItem = {
  id: number;
  name: string;
  price: number;
};

export async function getShopItem(id: number) {
  const getShopItem = db.prepare("SELECT * FROM Items WHERE id = ?");
  const shopItem = getShopItem.get(id) as ShopItem;

  return shopItem;
}

export async function addShopItem(item: ShopItem) {
  // TODO: Implement
}
