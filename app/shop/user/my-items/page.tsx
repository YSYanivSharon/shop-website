"use client";

import { useEffect, useState } from "react";
import { Purchase, PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import { getPurchaseHistory, getShopItem } from "@/lib/persist-module";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";

export default function MyItemsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);

  useEffect(() => {
    const loadPurchases = async () => {
      setPurchases((await getPurchaseHistory()) ?? []);
      setCustomDuckPrice((await getShopItem(0)).price);
    };
    loadPurchases();
  }, []);

  function getEntryElement(entry: PurchaseEntry, index: number) {
    const isCustom = entry.item.id === 0;
    const price = isCustom ? customDuckPrice : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const image = isCustom
      ? getImageOfCustomDuck(entry.item as CustomDuck)
      : getImageOfItem(entry.item as ShopItem);

    return (
      <div
        key={index}
        className="flex items-center justify-between bg-slate-800 text-slate-100 shadow rounded-lg p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            {image}
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-slate-400">
              ₪{price} × {entry.count}
            </p>
          </div>
        </div>
        <p className="font-bold">₪{price * entry.count}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">
        My Items
      </h1>
      <div className="space-y-6">
        {purchases.map((purchase) => {
          const total = purchase.entries.reduce((sum, e) => {
            const price =
              e.item.id === 0 ? customDuckPrice : (e.item as ShopItem).price;
            return sum + price * e.count;
          }, 0);

          return (
            <div
              key={purchase.id}
              className="bg-slate-900 text-slate-100 rounded-lg shadow-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <p className="font-semibold">
                  Order on {new Date(purchase.date).toLocaleDateString()}
                </p>
                <p className="font-bold">Total: ₪{total}</p>
              </div>
              <div className="space-y-3">
                {purchase.entries.map((entry, i) => getEntryElement(entry, i))}
              </div>
              <div className="text-sm text-slate-400 pt-2">
                Shipping to: {purchase.address.recipient},{" "}
                {purchase.address.street}, {purchase.address.city}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}