"use client";

import { getPurchaseHistory } from "@/lib/persist-module";
import { Purchase, PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import { useState, useEffect } from "react";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";

export default function Page() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadPurchases = async () => {
      setPurchases((await getPurchaseHistory()) ?? []);
    };
    if (!mounted) {
      loadPurchases();
      setMounted(true);
    }
  }, [mounted]);

  const renderEntry = (entry: PurchaseEntry, index: number) => {
    const isCustom = entry.item.id === 0;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const price = isCustom
      ? (entry.item as CustomDuck).price
      : (entry.item as ShopItem).price;
    const image = isCustom
      ? getImageOfCustomDuck(entry.item as CustomDuck)
      : getImageOfItem(entry.item as ShopItem);

    return (
      <div
        key={index}
        className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 mb-3 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            {image}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {name}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              ₪{price} × {entry.count}
            </p>
          </div>
        </div>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          ₪{price * entry.count}
        </p>
      </div>
    );
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
        My Items
      </h1>

      {purchases.length === 0 && (
        <p className="text-center text-slate-600 dark:text-slate-300">
          You have no past orders yet.
        </p>
      )}

      <div className="space-y-6">
        {purchases.map((purchase) => {
          const subtotal = purchase.entries.reduce((sum, e) => {
            const unit =
              e.item.id === 0
                ? (e.item as CustomDuck).price
                : (e.item as ShopItem).price;
            return sum + unit * e.count;
          }, 0);
          const total = subtotal + purchase.shippingPrice;

          return (
            <div
              key={purchase.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 shadow p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Order on {new Date(purchase.date).toLocaleDateString()}
                </h2>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  Total: ₪{total}
                </span>
              </div>
              <div>{purchase.entries.map(renderEntry)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                Shipping to: {purchase.address.recipient},{" "}
                {purchase.address.city}, {purchase.address.country}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}