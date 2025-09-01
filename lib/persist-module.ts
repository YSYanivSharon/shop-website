"use server";

import sqlite from "better-sqlite3";
import fs from "fs";
import {
  AuthLevel,
  User,
  ShopItem,
  ItemType,
  CustomDuckPartsCatalog,
  PurchaseEntry,
  Purchase,
  CreditCardDetails,
  UserEvent,
} from "@/lib/types";
import { getVerifiedSession, storeVerifiedSession } from "@/lib/auth";

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

export async function getUserByEmail(email: string) {
  const getUser = db.prepare("SELECT * FROM Users WHERE email = ?");
  const dbUser = getUser.get(email) as DBUser;

  if (dbUser) return DBUserToUser(dbUser);

  return null;
}

export async function getUserById(id: number) {
  const getUser = db.prepare("SELECT * FROM Users WHERE id = ?");
  const dbUser = getUser.get(id) as DBUser;

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
    `public/images/item-images/${item.id}.png`,
    Buffer.from(await image.arrayBuffer()),
    (err) => {
      console.log("Failed to save image: ", err);
    },
  );

  return item;
}

export async function getWishlist() {
  const user = await getVerifiedSession();
  if (!user) {
    return [];
  }

  return user.wishlist;
}

async function trySetWishlist(wishlist: number[]) {
  const user = await getVerifiedSession();
  if (!user) {
    return false;
  }

  const setWishlist = db.prepare("UPDATE Users SET wishlist = ? WHERE id = ?");
  const runInfo = setWishlist.run(JSON.stringify(wishlist), user.id);

  if (runInfo.changes > 0) {
    user.wishlist = wishlist;
    await storeVerifiedSession(user);

    return true;
  }

  return false;
}

export async function tryAddItemToWishlist(itemId: number) {
  const wishlist = await getWishlist();

  if (!wishlist) return false;

  if (wishlist.includes(itemId)) return false;

  const item = await getShopItem(itemId);
  if (!item) return false;

  wishlist.push(itemId);

  const success = await trySetWishlist(wishlist);

  if (success) {
    await addUserEvent(6, [item.name]);
  }

  return success;
}

export async function tryRemoveItemFromWishlist(itemId: number) {
  let wishlist = await getWishlist();

  if (!wishlist) return false;

  const newWishlist = wishlist.filter((id) => id != itemId);

  if (newWishlist.length == wishlist.length) return false;

  const success = await trySetWishlist(newWishlist);

  if (success) {
    const item = await getShopItem(itemId);
    await addUserEvent(7, [item.name]);
  }

  return success;
}

export async function getShippingPrice(address: PaymentAddress) {
  // Pretend that there is actual logic here
  return 10;
}

export async function pay(
  cart: PurchaseEntry[],
  address: PaymentAddress,
  card: CreditCardDetails,
) {
  const user = await getVerifiedSession();

  if (!user) return false;

  // Recalculate the price and remove invalid items in case that the user manipulated the cart
  var price = 0;
  var actualCart = [];

  for (var entry of cart) {
    var item = await getShopItem(entry.item.id);
    if (item) {
      price += item.price;
      actualCart.push(entry);
    }
  }

  // Fail if there are no valid items
  if (actualCart.length == 0) {
    return false;
  }

  const shippingPrice = await getShippingPrice(address);
  price += shippingPrice;

  // Pretend that there is actual logic here for the payment

  // Save the purchase
  const addPurchase = db.prepare(
    "INSERT INTO Purchases (userId, date, entries, shippingPrice, address) VALUES (?, ?, ?, ?, ?)",
  );

  const results = addPurchase.run(
    user.id,
    Date.now(),
    JSON.stringify(actualCart),
    shippingPrice,
    JSON.stringify(address),
  );

  return results.changes > 0;
}

type DBPurchase = {
  id: number;
  userId: number;
  date: number;
  entries: string;
  shippingPrice: number;
  address: string;
};

function dbPurchaseToPurchase(dbPurchase: DBPurchase) {
  return {
    id: dbPurchase.id,
    userId: dbPurchase.userId,
    date: dbPurchase.date,
    entries: JSON.parse(dbPurchase.entries),
    shippingPrice: dbPurchase.shippingPrice,
    address: JSON.parse(dbPurchase.address),
  } as Purchase;
}

export async function getPurchaseHistory() {
  const user = await getVerifiedSession();

  if (!user) return false;

  const getPurchasesOfUser = db.prepare(
    "SELECT * FROM Purchases WHERE userId = ?",
  );

  const dbPurchaseHistory = getPurchasesOfUser.all(user.id) as DBPurchase[];

  const purchaseHistory = dbPurchaseHistory.map(dbPurchaseToPurchase);

  return purchaseHistory;
}

type DBUserEvent = {
  id: number;
  date: number;
  userId: number;
  eventType: number;
  details: string;
};

function dbUserEventToUserEvent(dbUserEvent: DBUserEvent) {
  return {
    id: dbUserEvent.id,
    date: dbUserEvent.date,
    userId: dbUserEvent.userId,
    eventType: dbUserEvent.eventType,
    details: JSON.parse(dbUserEvent.details),
  } as UserEvent;
}

export async function addUserEvent(eventType: number, details: string[]) {
  const user = await getVerifiedSession();

  // Don't log actions that are done by people who are not logged in
  if (!user) return;

  const addEvent = db.prepare(
    "INSERT INTO UserEvents (date, userId, eventType, details) VALUES (?, ?, ?, ?)",
  );

  addEvent.run(Date.now(), user.id, eventType, JSON.stringify(details));
}

export async function getLatestUserEvents(count: number) {
  const getEvents = db.prepare(
    "SELECT * FROM UserEvents ORDER BY date DESC LIMIT (?)",
  );

  const dbUserEvents = getEvents.all(count) as DBUserEvent[];

  return dbUserEvents.map(dbUserEventToUserEvent);
}
