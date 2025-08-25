"use client";

import { User } from "@/lib/types";
import {
  createContext,
  useState,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
} from "react";
import * as Server from "@/lib/auth";
import {
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

export async function tryAddItemToWishlist(itemId: number) {
  const succeeded = await tryAddItemToServerWishlist(itemId);

  if (succeeded) {
    let newUserState = loadCurrUser();
    newUserState?.wishlist.push(itemId);
    setCurrUser(newUserState);
  }
}

export async function tryRemoveItemFromWishlist(itemId: number) {
  const succeeded = await tryRemoveItemFromServerWishlist(itemId);

  if (succeeded) {
    let newUserState = loadCurrUser();
    if (newUserState) {
      newUserState.wishlist = newUserState?.wishlist.filter(
        (item) => item != itemId,
      );
      setCurrUser(newUserState);
    }
  }
}
