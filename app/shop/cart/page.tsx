"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input } from "@headlessui/react";
import { PurchaseEntry, ShopItem, CustomDuck } from "@/lib/types";
import {
  getCart,
  removeEntryFromCart,
  setEntryCountInCart,
} from "@/app/components/shopping-cart";
import { getShopItem } from "@/lib/persist-module";
import { match, P } from "ts-pattern";
import { getImageOfItem } from "@/app/components/item-images";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [cart, setCart] = useState<PurchaseEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadCart = async function () {
      setCart(getCart());
      setMounted(true);
    };

    if (!mounted) {
      loadCart();
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
        <div>
          <Button
            type="button"
            onClick={() => {
              setCart(removeEntryFromCart(index));
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
                setCart(setEntryCountInCart(index, count));
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
        <p>Item {item.id}</p>
      </>
    );
  }

  function getCustomDuckElement(duck: CustomDuck) {
    return <></>;
  }

  return <div>{cart.map((entry, index) => getEntryElement(entry, index))}</div>;
}
