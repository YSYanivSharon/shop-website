"use server";

import sqlite from "better-sqlite3";
import fs from "fs";
import { User, ShopItem, ItemType } from "@/lib/types";

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

// Shop items
export async function getShopItem(id: number) {
  const getShopItem = db.prepare("SELECT * FROM Items WHERE id = ?");
  const shopItem = getShopItem.get(id) as ShopItem;

  return shopItem;
}

export async function getCatalog() {
  const getCatalog = db.prepare(
    "SELECT * FROM Items WHERE type = ?"
  );
  const catalog = getCatalog.all(ItemType.Duck) as ShopItem[];

  return catalog;
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