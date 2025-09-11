"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Purchase, PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import { getLastPurchase, getShopItem } from "@/lib/persist-module";
import { getImageOfCustomDuck, getImageOfItem } from "@/app/components/item-images";
import { CheckCircleIcon, ShoppingCartIcon, HomeIcon } from "@heroicons/react/24/solid";

export default function PostPaymentPage() {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [customDuckPrice, setCustomDuckPrice] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setCustomDuckPrice((await getShopItem(0)).price);
      setPurchase(await getLastPurchase());
    };
    if (!mounted) {
      load();
      setMounted(true);
    }
  }, [mounted]);

  const renderEntry = (entry: PurchaseEntry, i: number) => {
    const isCustom = entry.item.id === 0;
    const unitPrice = isCustom ? customDuckPrice : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const image = isCustom
      ? getImageOfCustomDuck(entry.item as CustomDuck)
      : getImageOfItem(entry.item as ShopItem);

    return (
      <div
        key={i}
        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 flex items-center justify-center">{image}</div>
          <div>
            <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">{name}</p>
            <p className="text-base text-slate-600 dark:text-slate-300">₪{unitPrice} × {entry.count}</p>
          </div>
        </div>
        <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">
          ₪{unitPrice * entry.count}
        </div>
      </div>
    );
  };

  if (!purchase) {
    return (
      <main className="max-w-3xl mx-auto p-10 text-center">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Thank you!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          We couldn’t find a recent order. Browse the catalog to start shopping.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gray-200 dark:bg-slate-700 text-lg text-slate-900 dark:text-slate-100 hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            <HomeIcon className="w-6 h-6" />
            Home
          </Link>
          <Link
            href="/shop/catalog"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-lg text-black"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = purchase.entries.reduce((sum, e) => {
    const unit = e.item.id === 0 ? customDuckPrice : (e.item as ShopItem).price;
    return sum + unit * e.count;
  }, 0);
  const total = subtotal + purchase.shippingPrice;

  return (
    <main className="max-w-5xl mx-auto p-10">
      <div className="text-center mb-10">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Thank you for your purchase!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-3">Your order is confirmed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          {purchase.entries.map(renderEntry)}
        </section>

        <aside className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Summary</h2>
          <div className="flex justify-between text-lg text-slate-600 dark:text-slate-300">
            <span>Items</span>
            <span>₪{subtotal}</span>
          </div>
          <div className="flex justify-between text-lg text-slate-600 dark:text-slate-300">
            <span>Shipping</span>
            <span>₪{purchase.shippingPrice}</span>
          </div>
          <hr className="border-slate-200 dark:border-slate-700" />
          <div className="flex justify-between text-2xl font-bold text-slate-900 dark:text-slate-100">
            <span>Total</span>
            <span>₪{total}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-base font-medium text-slate-600 dark:text-slate-300 mb-2">Shipping Address</h3>
            <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {purchase.address.recipient}<br />
              {purchase.address.street}<br />
              {purchase.address.city}, {purchase.address.country}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-gray-200 dark:bg-slate-700 text-lg text-slate-900 dark:text-slate-100 hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          <HomeIcon className="w-6 h-6" />
          Home
        </Link>
        <Link
          href="/shop/catalog"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-lg text-black"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}