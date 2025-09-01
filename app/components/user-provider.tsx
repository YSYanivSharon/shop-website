"use client";

import { User, PurchaseEntry, ShopItem, CreditCardDetails } from "@/lib/types";
import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import * as Server from "@/lib/auth";
import {
  tryAddItemToCart as tryAddItemToServerCart,
  tryAddCustomDuckToCart as tryAddCustomDuckToServerCart,
  trySetEntryCountInCart as trySetEntryCountInServerCart,
  tryRemoveEntryFromCart as tryRemoveEntryFromServerCart,
  tryPay as tryServerPay,
  tryAddItemToWishlist as tryAddItemToServerWishlist,
  tryRemoveItemFromWishlist as tryRemoveItemFromServerWishlist,
} from "@/lib/persist-module";

export const StorageKey = "user";
const isServer = typeof window === "undefined";
export const UserContext = createContext<User | null>(null);
let setState: Dispatch<SetStateAction<User | null>>;

export function UserProvider({ children }: PropsWithChildren<unknown>) {
  const [currUser, setCurrUser] = useState(() => loadCurrUser());

  setState = setCurrUser;

  return <UserContext value={currUser}>{children}</UserContext>;
}

/*
 * Loads the current user from the persistent storage if there is one
 */
function loadCurrUser() {
  if (isServer) return null;

  try {
    const userJson = localStorage.getItem(StorageKey);

    if (!userJson) return null;

    return (JSON.parse(userJson) as User) || null;
  } catch (e) {
    // Unsupported
    return null;
  }
}

export function setCurrUser(user: User | null) {
  localStorage.setItem(StorageKey, JSON.stringify(user));

  setState(user);
}

export async function signup(email: string, password: string) {
  const result = await Server.signup(email, password);

  if (typeof result === "string") return result;

  setCurrUser(result);

  return result;
}

export async function login(email: string, password: string) {
  // First, check if there is a mismatch between the local storage and cookies
  let user = await Server.getVerifiedSession();

  if (!user) {
    user = await Server.login(email, password);
  }

  setCurrUser(user);
  return user;
}

export async function logout() {
  await Server.logout();
  setCurrUser(null);
}

function addEntryToCart(entry: PurchaseEntry) {
  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  const cartEntry = newUserState.cart.find((cartEntry) => {
    return JSON.stringify(cartEntry.item) == JSON.stringify(entry.item);
  });

  if (cartEntry) {
    cartEntry.count += entry.count;
  } else {
    newUserState.cart.push(entry);
  }

  setCurrUser(newUserState);

  return true;
}

export async function tryAddItemToCart(item: ShopItem, count: number) {
  const succeeded = await tryAddItemToServerCart(item, count);

  if (!succeeded) return false;

  addEntryToCart({ item: item, count: count });

  return true;
}

export async function tryAddCustomDuckToCart(
  color: ShopItem,
  head: ShopItem,
  body: ShopItem,
) {
  const succeeded = await tryAddCustomDuckToServerCart(color, head, body);

  if (!succeeded) return false;

  addEntryToCart({
    item: { id: 0, color: color, head: head, body: body },
    count: 1,
  });

  return true;
}

export async function trySetEntryCountInCart(
  entryIndex: number,
  count: number,
) {
  const succeeded = await trySetEntryCountInServerCart(entryIndex, count);

  if (!succeeded) return false;

  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  newUserState.cart[entryIndex].count = count;

  setCurrUser(newUserState);

  return true;
}

export async function tryRemoveEntryFromCart(entryIndex: number) {
  const succeeded = await tryRemoveEntryFromServerCart(entryIndex);

  if (!succeeded) return false;

  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  newUserState.cart = newUserState.cart.filter(
    (_, index) => index != entryIndex,
  );

  setCurrUser(newUserState);

  return true;
}

export async function tryPay(address: PaymentAddress, card: CreditCardDetails) {
  const succeeded = await tryServerPay(address, card);

  if (!succeeded) return false;

  // Clear the cart client-side
  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  newUserState.cart = [];

  setCurrUser(newUserState);

  return true;
}

export async function tryAddItemToWishlist(itemId: number) {
  const succeeded = await tryAddItemToServerWishlist(itemId);

  if (!succeeded) return false;

  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  newUserState.wishlist.push(itemId);

  setCurrUser(newUserState);

  return true;
}

export async function tryRemoveItemFromWishlist(itemId: number) {
  const succeeded = await tryRemoveItemFromServerWishlist(itemId);

  if (!succeeded) return false;

  let newUserState = loadCurrUser();

  if (!newUserState) return false;

  newUserState.wishlist = newUserState.wishlist.filter((id) => id != itemId);
  setCurrUser(newUserState);

  return true;
}
