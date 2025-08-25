"use server";

import sqlite from "better-sqlite3";
import fs from "fs";
import {
  AuthLevel,
  User,
  ShopItem,
  ItemType,
  CustomDuckPartsCatalog,
} from "@/lib/types";
import { getVerifiedSession } from "@/lib/auth";

const db = await openDb();

// Open SQLite database connection
async function openDb() {
  const options = {
    fileMustExist: true,
    // verbose: console.log
  };
  return sqlite("./database.sqlite3", options);
}

type DBUser = {
  id: number;
  email: string;
  password: string;
  authLevel: AuthLevel;
  wishlist: string;
};

function DBUserToUser(dbUser: DBUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    password: dbUser.password,
    authLevel: dbUser.authLevel,
    wishlist: JSON.parse(dbUser.wishlist),
  };
}

// Authentication
export async function addUser(
  email: string,
  hashedPassword: string,
  authLevel: number,
) {
  const insertUser = db.prepare(
    "INSERT INTO Users (email, password, authLevel) VALUES (?, ?, ?) RETURNING *",
  );

  const dbUser = insertUser.get(email, hashedPassword, authLevel) as DBUser;

  if (dbUser) return DBUserToUser(dbUser);

  return null;
}

export async function getUser(email: string) {
  const getUser = db.prepare("SELECT * FROM Users WHERE email = ?");
  const dbUser = getUser.get(email) as DBUser;

  if (dbUser) return DBUserToUser(dbUser);

  return null;
}

// Shop items
export async function getShopItem(id: number) {
  const getShopItem = db.prepare("SELECT * FROM Items WHERE id = ?");
  const shopItem = getShopItem.get(id) as ShopItem;

  return shopItem;
}

export async function getCatalog() {
  const getProductsOfType = db.prepare("SELECT * FROM Items WHERE type = ?");
  const catalog = getProductsOfType.all(ItemType.Duck) as ShopItem[];

  return catalog;
}

export async function getDuckParts() {
  const getProductsOfType = db.prepare("SELECT * FROM Items WHERE type = ?");

  const colors = getProductsOfType.all(ItemType.DuckColor) as ShopItem[];
  const heads = getProductsOfType.all(ItemType.DuckHead) as ShopItem[];
  const bodies = getProductsOfType.all(ItemType.DuckBody) as ShopItem[];

  return { colors, heads, bodies } as CustomDuckPartsCatalog;
}

export async function addShopItem(
  name: string,
  price: number,
  type: ItemType,
  image: File,
) {
  if (image.type != "image/png") {
    return "Image file must be a png";
  }

  const addShopItem = db.prepare(
    "INSERT INTO Items (name, price, type) VALUES (?, ?, ?) RETURNING *",
  );

  const item = addShopItem.get(name, price, type) as ShopItem;

  fs.writeFile(
    `public/item-images/${item.id}.png`,
    Buffer.from(await image.arrayBuffer()),
    (err) => {
      console.log("Failed to save image: ", err);
    },
  );

  return item;
}

async function getWishlist() {
  const user = await getVerifiedSession();
  if (!user) {
    return null;
  }

  const getWishlist = db.prepare("SELECT wishlist FROM Users WHERE id = ?");
  const wishlist = (getWishlist.get(user.id) as { wishlist: string }).wishlist;

  return JSON.parse(wishlist ?? "[]") as number[];
}

async function trySetWishlist(wishlist: number[]) {
  const user = await getVerifiedSession();
  if (!user) {
    return false;
  }

  const setWishlist = db.prepare("UPDATE Users SET wishlist = ? WHERE id = ?");
  const runInfo = setWishlist.run(JSON.stringify(wishlist), user.id);

  return runInfo.changes > 0;
}

export async function tryAddItemToWishlist(itemId: number) {
  const wishlist = await getWishlist();

  if (!wishlist) {
    return false;
  }

  if (!wishlist.includes(itemId)) {
    wishlist.push(itemId);
  }

  return await trySetWishlist(wishlist);
}

export async function tryRemoveItemFromWishlist(itemId: number) {
  let wishlist = await getWishlist();

  if (!wishlist) {
    return false;
  }

  wishlist = wishlist.filter((id) => {
    id != itemId;
  });

  return await trySetWishlist(wishlist);
}
