"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import {
  UserContext,
  tryRemoveEntryFromCart,
  trySetEntryCountInCart,
} from "@/app/components/user-provider";
import { getShopItem } from "@/lib/persist-module";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";
import {
  TrashIcon,
  CreditCardIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";

export default function CartPage() {
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");

  const user = useContext(UserContext);
  const cart = mounted ? (user?.cart ?? []) : [];

  useEffect(() => {
    const loadCustomDuckPrice = async function () {
      setCustomDuckPrice((await getShopItem(0)).price);
    };
    if (!mounted) {
      loadCustomDuckPrice();
      setMounted(true);
    }
  }, [mounted]);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function updateQuantity(index: number, newCount: number) {
    if (newCount < 1) {
      showMessage("Quantity must be at least 1");
      return;
    }
    if (newCount > 99) {
      showMessage("Maximum quantity is 99");
      return;
    }
    trySetEntryCountInCart(index, newCount);
  }

  function removeItem(index: number) {
    tryRemoveEntryFromCart(index);
    showMessage("Item removed from cart");
  }

  function renderEntry(entry: PurchaseEntry, index: number) {
    const isCustom = entry.item.id === 0;
    const unitPrice = isCustom
      ? customDuckPrice
      : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const image = isCustom
      ? getImageOfCustomDuck(entry.item as CustomDuck)
      : getImageOfItem(entry.item as ShopItem);

    return (
      <div
        key={index}
        className="flex items-center justify-between bg-white dark:bg-slate-900 shadow-md hover:shadow-lg rounded-xl p-4 mb-3 border border-gray-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center">
            {image}
          </div>
          <div>
            <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {name}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              ₪{unitPrice} each
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subtotal:{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ₪{unitPrice * entry.count}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(index, entry.count - 1)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={entry.count <= 1}
              aria-label="Decrease quantity"
            >
              <MinusIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>
            <input
              type="text"
              min={1}
              max={99}
              value={entry.count}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) updateQuantity(index, value);
              }}
              className="w-12 text-center border-0 bg-transparent text-slate-900 dark:text-slate-100 focus:ring-0 focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={() => updateQuantity(index, entry.count + 1)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={entry.count >= 99}
              aria-label="Increase quantity"
            >
              <PlusIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <button
            onClick={() => removeItem(index)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Remove from cart"
            title="Remove from cart"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, entry) => {
    const price =
      entry.item.id === 0 ? customDuckPrice : (entry.item as ShopItem).price;
    return sum + price * entry.count;
  }, 0);

  const totalItems = cart.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Your Cart
        </h1>
        {cart.length > 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
          </div>
        )}
      </div>
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-center font-medium transition-all ${
            message.includes("removed") ||
            message.includes("must") ||
            message.includes("Maximum")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCartIcon className="h-16 w-16 mx-auto mb-4 text-gray-500 dark:text-gray-300" />
          <p className="text-slate-600 dark:text-slate-300 text-xl mb-6">
            Your cart is empty
          </p>
          <Link
            href="/shop/catalog"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((entry, i) => renderEntry(entry, i))}
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-600 dark:text-slate-300">
                Items ({totalItems}):
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                ₪{total}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className="border-slate-200 dark:border-slate-600" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-slate-900 dark:text-slate-100">Total:</span>
              <span className="text-slate-900 dark:text-slate-100">
                ₪{total}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/shop/catalog"
                className="flex-1 text-center bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/shop/checkout"
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
              >
                <CreditCardIcon className="h-5 w-5" />
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
