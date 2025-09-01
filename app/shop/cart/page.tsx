"use client";

import { useState, useEffect, useContext } from "react";
import { Button, Input } from "@headlessui/react";
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
import { TrashIcon, CreditCardIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadCustomDuckPrice = async function () {
      setCustomDuckPrice((await getShopItem(0)).price);
    };

    if (!mounted) {
      loadCustomDuckPrice();
      setMounted(true);
    }
  });

  const user = useContext(UserContext);
  const cart = mounted ? (user?.cart ?? []) : [];

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
        <div>
          <Button
            type="button"
            onClick={() => {
              tryRemoveEntryFromCart(index);
            }}
          >
            <TrashIcon className="size-6" />
          </Button>
          <Input
            type="number"
            value={cart[index].count}
            onChange={(e) => {
              const count = Number.parseInt(e.target.value);

              if (count >= 1) {
                trySetEntryCountInCart(index, count);
              }
            }}
          />
        </div>
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
      {cart.length == 0 && <p>The shopping cart is empty</p>}
      {cart.length > 0 && (
        <>
          <div>{cart.map((entry, index) => getEntryElement(entry, index))}</div>
          <Link href="/shop/checkout" className="flex">
            <CreditCardIcon className="size-6" />
            <span className="w-1.5" />
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}
