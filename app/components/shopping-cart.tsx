"use client";

import { PurchaseEntry, ShopItem } from "@/lib/types";

const CartKey = "cart";

export function getCart() {
  return JSON.parse(localStorage.getItem(CartKey) ?? "[]") as PurchaseEntry[];
}

function setCart(cart: PurchaseEntry[]) {
  localStorage.setItem(CartKey, JSON.stringify(cart));
}

export function addEntryToCart(entry: PurchaseEntry) {
  const cart = getCart();
  const cartEntry = cart.find((cartEntry) => {
    cartEntry.item == entry.item;
  });

  if (cartEntry) {
    cartEntry.count += entry.count;
  } else {
    cart.push(entry);
  }

  setCart(cart);
  return cart;
}

export function addItemToCart(item: ShopItem, count: number) {
  addEntryToCart({ item: item, count: count });
}

export function addCustomDuckToCart(
  color: ShopItem,
  head: ShopItem,
  body: ShopItem,
) {
  addEntryToCart({
    item: { id: 0, color: color, head: head, body: body },
    count: 1,
  });
}

export function setEntryCountInCart(entryIndex: number, count: number) {
  const cart = getCart();

  cart[entryIndex].count = count;

  setCart(cart);
  return cart;
}

export function removeEntryFromCart(entryIndex: number) {
  let cart = getCart();
  cart = cart.filter((_, index) => index != entryIndex);
  setCart(cart);
  return cart;
}
