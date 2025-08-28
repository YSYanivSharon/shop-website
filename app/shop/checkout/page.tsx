"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@headlessui/react";
import {
  PurchaseEntry,
  ShopItem,
  CustomDuck,
  CreditCardDetails,
} from "@/lib/types";
import { clearCart, getCart } from "@/app/components/shopping-cart";
import { getShippingPrice, getShopItem, pay } from "@/lib/persist-module";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [cart, setCart] = useState<PurchaseEntry[]>([]);
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<PaymentAddress | null>(null);
  const [creditCardDetails, setCreditCardDetails] =
    useState<CreditCardDetails | null>(null);

  useEffect(() => {
    const loadCart = async function () {
      setCart(getCart());
    };
    const loadCustomDuckPrice = async function () {
      setCustomDuckPrice((await getShopItem(0)).price);
    };

    if (!mounted) {
      loadCart();
      loadCustomDuckPrice();
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

  async function onPay() {
    if (!address) {
      // TODO: Notify the user that the address is invalid
      return;
    }

    if (!creditCardDetails) {
      // TODO: Notify the user that the credit card is invalid
      return;
    }

    const successful = await pay(cart, address, creditCardDetails);

    if (successful) {
      clearCart();
      router.replace("/shop/user/my-items");
    } else {
      // TODO: handle failures
    }
  }

  return (
    <div>
      <div>
        {cart.length == 0 && <p>The shopping cart is empty</p>}
        {cart.length > 0 &&
          cart.map((entry, index) => getEntryElement(entry, index))}
      </div>
      <p>Shipping: {address ? getShippingPrice(address) : "TBD"}</p>
      <Button onClick={onPay} className="flex">
        <CreditCardIcon className="size-6" />
        <span className="w-1.5" />
        Pay
      </Button>
    </div>
  );
}
