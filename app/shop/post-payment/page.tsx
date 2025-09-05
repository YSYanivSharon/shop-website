"use client";

import { useState, useEffect, useContext } from "react";
import { Button, Input } from "@headlessui/react";
import Link from "next/link";
import { Purchase, PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import {
  UserContext,
  tryRemoveEntryFromCart,
  trySetEntryCountInCart,
} from "@/app/components/user-provider";
import { getShopItem, getLastPurchase } from "@/lib/persist-module";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";
import { TrashIcon, CreditCardIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadCustomDuckPrice = async function () {
      setCustomDuckPrice((await getShopItem(0)).price);
    };
    const loadLastPurchase = async function () {
      setPurchase(await getLastPurchase());
    };

    if (!mounted) {
      loadCustomDuckPrice();
      loadLastPurchase();
      setMounted(true);
    }
  });

  function getEntryElement(entry: PurchaseEntry, index: number) {
    let innerElement;
    let unitPrice;
    if (entry.item.id == 0) {
      innerElement = getCustomDuckElement(entry.item as CustomDuck);
      unitPrice = customDuckPrice;
    } else {
      innerElement = getItemElement(entry.item as ShopItem);
      unitPrice = (entry.item as ShopItem).price;
    }

    return (
      <div key={index}>
        <div>Position: {index + 1}</div>
        <div>{innerElement}</div>
        <p>Price: {unitPrice * entry.count}</p>
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
      <p>Thank you for your purchase!</p>
      <div>
        {purchase?.entries.map((entry, index) => getEntryElement(entry, index))}
      </div>
    </div>
  );
}
