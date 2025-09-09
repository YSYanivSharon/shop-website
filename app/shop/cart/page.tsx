"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import { getCart, removeEntryFromCart, setEntryCountInCart } from "@/app/components/shopping-cart";
import { getShopItem } from "@/lib/persist-module";
import { getImageOfCustomDuck, getImageOfItem } from "@/app/components/item-images";
import { TrashIcon, CreditCardIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

function ItemImage({ entry }: { entry: PurchaseEntry }) {
  const isCustom = entry.item.id === 0;
  return (
    <div className="w-24 h-24 flex items-center justify-center">
      {isCustom
        ? getImageOfCustomDuck(entry.item as CustomDuck)
        : getImageOfItem(entry.item as ShopItem)}
    </div>
  );
}

export default function CartPage() {
  const [cart, setCart] = useState<PurchaseEntry[]>([]);
  const [customDuckPrice, setCustomDuckPrice] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setCart(getCart());
      const custom = await getShopItem(0);
      setCustomDuckPrice(custom.price);
    }
    if (!mounted) {
      load();
      setMounted(true);
    }
  }, [mounted]);

  function showMessage(msg: string, isError: boolean = false) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function updateQuantity(index: number, newCount: number) {
    if (newCount < 1) {
      showMessage("Quantity cannot be less than 1", true);
      return;
    }
    if (newCount > 99) {
      showMessage("Maximum quantity is 99", true);
      return;
    }

    const updatedCart = setEntryCountInCart(index, newCount);
    setCart(updatedCart);
    showMessage(`Quantity updated to ${newCount}`);
  }

  function removeItem(index: number) {
    const itemName = cart[index].item.id === 0 ? "Custom Duck" : (cart[index].item as ShopItem).name;
    const updatedCart = removeEntryFromCart(index);
    setCart(updatedCart);
    showMessage(`${itemName} removed from cart`);
  }

  function EntryRow(entry: PurchaseEntry, index: number) {
    const isCustom = entry.item.id === 0;
    const unit = isCustom ? customDuckPrice : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;

    return (
      <div
        key={index}
        className="flex items-center justify-between bg-white dark:bg-slate-900 shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 border border-gray-100 dark:border-slate-700"
      >
        <div className="flex items-center gap-4">
          <ItemImage entry={entry} />
          <div>
            <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">{name}</p>
            <p className="text-slate-600 dark:text-slate-300">
              ₪{unit} each
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subtotal: <span className="font-semibold text-slate-900 dark:text-slate-100">₪{unit * entry.count}</span>
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
              type="number"
              min={1}
              max={99}
              value={entry.count}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  updateQuantity(index, value);
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                  updateQuantity(index, 1);
                }
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
    const price = entry.item.id === 0 ? customDuckPrice : (entry.item as ShopItem).price;
    return sum + price * entry.count;
  }, 0);

  const totalItems = cart.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Your Cart</h1>
        {cart.length > 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center font-medium transition-all ${
          message.includes("removed") || message.includes("cannot") || message.includes("Maximum")
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-slate-600 dark:text-slate-300 text-xl mb-6">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((entry, i) => EntryRow(entry, i))}
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-slate-600 dark:text-slate-300">Items ({totalItems}):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">₪{total}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>

            <hr className="border-slate-200 dark:border-slate-600" />

            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-slate-900 dark:text-slate-100">Total:</span>
              <span className="text-slate-900 dark:text-slate-100">₪{total}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/shop"
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