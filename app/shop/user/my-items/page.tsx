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
    const loadPurchases = async function () {
      setPurchases((await getPurchaseHistory()) ?? []);
    };

    if (!mounted) {
      loadPurchases();
      setMounted(true);
    }
  });

  function getEntryElement(entry: PurchaseEntry, index: number) {
    let innerElement;
    if (entry.item.id == 0) {
      innerElement = getCustomDuckElement(entry.item as CustomDuck);
    } else {
      innerElement = getItemElement(entry.item as ShopItem);
    }

    return (
      <div key={index}>
        <div>Position: {index + 1}</div>
        <div>{innerElement}</div>
      </div>
    );
  }

  function getItemElement(item: ShopItem) {
    return (
      <>
        {getImageOfItem(item)}
        <p>{item.name}</p>
      </>
    );
  }

  function getCustomDuckElement(duck: CustomDuck) {
    return (
      <>
        {getImageOfCustomDuck(duck)}
        <p>Custom duck</p>
      </>
    );
  }

  return (
    <div>
      {purchases.map((purchase) => (
        <div key={purchase.id}>
          At: {new Date(purchase.date).toString()}
          <br />
          Items: {purchase.entries.map(getEntryElement)}
        </div>
      ))}
    </div>
  );
}
