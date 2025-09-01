"use client";

import { User, PurchaseEntry, ShopItem, CreditCardDetails } from "@/lib/types";
import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useEffect,
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
export const UserContext = createContext<User | null>(null);
let setProvidedUser: Dispatch<SetStateAction<User | null>>;
let reloadUser: () => Promise<void>;

export function UserProvider({ children }: PropsWithChildren<unknown>) {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      loadUser();
      setMounted(true);
    }
  }, []);

  const loadUser = async () => {
    setCurrUser(await Server.getVerifiedSession());
  };

  setProvidedUser = setCurrUser;
  reloadUser = loadUser;

  return <UserContext value={currUser}>{children}</UserContext>;
}

export async function signup(email: string, password: string) {
  const result = await Server.signup(email, password);

  if (typeof result === "string") return result;

  setProvidedUser(result);

  return result;
}

export async function login(email: string, password: string) {
  // First, check if there is a mismatch between the local storage and cookies
  let user = await Server.getVerifiedSession();

  if (!user) {
    user = await Server.login(email, password);
  }

  setProvidedUser(user);
  return user;
}

export async function logout() {
  await Server.logout();
  setProvidedUser(null);
}

export async function tryAddItemToCart(item: ShopItem, count: number) {
  const succeeded = await tryAddItemToServerCart(item.id, count);

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function tryAddCustomDuckToCart(
  color: ShopItem,
  head: ShopItem,
  body: ShopItem,
) {
  const succeeded = await tryAddCustomDuckToServerCart(
    color.id,
    head.id,
    body.id,
  );

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function trySetEntryCountInCart(
  entryIndex: number,
  count: number,
) {
  const succeeded = await trySetEntryCountInServerCart(entryIndex, count);

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function tryRemoveEntryFromCart(entryIndex: number) {
  const succeeded = await tryRemoveEntryFromServerCart(entryIndex);

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function tryPay(address: PaymentAddress, card: CreditCardDetails) {
  const succeeded = await tryServerPay(address, card);

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function tryAddItemToWishlist(itemId: number) {
  const succeeded = await tryAddItemToServerWishlist(itemId);

  if (!succeeded) return false;

  reloadUser();

  return true;
}

export async function tryRemoveItemFromWishlist(itemId: number) {
  const succeeded = await tryRemoveItemFromServerWishlist(itemId);

  if (!succeeded) return false;

  reloadUser();

  return true;
}
