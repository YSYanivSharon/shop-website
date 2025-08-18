"use client";

import { Dictionary } from "@/lib/types";

const CartKey = "cart";

function getCart() {
  return JSON.parse(
    localStorage.getItem(CartKey) ?? "{}",
  ) as Dictionary<number>;
}

function setCart(cart: Dictionary<number>) {
  localStorage.setItem(CartKey, JSON.stringify(cart));
}

export function addItemToCart(itemId: number, count: number) {
  const cart = getCart();
  cart[itemId] = (cart[itemId] ?? 0) + count;
  setCart(cart);
}

export function setItemCountInCart(itemId: number, count: number) {
  const cart = getCart();
  cart[itemId] = count;
  setCart(cart);
}

export function removeItemFromCart(itemId: number) {
  const cart = getCart();
  delete cart[itemId];
  setCart(cart);
}
