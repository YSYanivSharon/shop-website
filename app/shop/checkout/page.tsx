"use client";

import z from "zod";
import { useState, useEffect, useContext } from "react";
import Form from "next/form";
import { Button, Input } from "@headlessui/react";
import {
  PurchaseEntry,
  ShopItem,
  CustomDuck,
  Address,
  CreditCardDetails,
} from "@/lib/types";
import { getShippingPrice, getShopItem } from "@/lib/persist-module";
import { UserContext, tryPay } from "@/app/components/user-provider";
import {
  getImageOfCustomDuck,
  getImageOfItem,
} from "@/app/components/item-images";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    country: "",
    postalCode: "",
    recipient: "",
  } as Address);
  const [card, setCard] = useState<CreditCardDetails>({
    number: "",
    name: "",
    code: "",
    expirationMonth: new Date().getMonth(),
    expirationYear: new Date().getFullYear() % 100,
  } as CreditCardDetails);
  const [shippingPrice, setShippingPrice] = useState<number | string>("TBD");

  useEffect(() => {
    const loadCustomDuckPrice = async function () {
      setCustomDuckPrice((await getShopItem(0)).price);
    };

    if (!mounted) {
      loadCustomDuckPrice();
      setMounted(true);
    }
  });

  useEffect(() => {
    const updateShippingPrice = async () => {
      setShippingPrice(await getShippingPrice(address));
    };

    updateShippingPrice();
  }, [address]);

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

  async function onPay(_: FormData) {
    const successful = await tryPay(address, card);

    if (successful) {
      router.push("/shop/post-payment");
    } else {
      alert("Payment failed. Check your information and try again.");
    }
  }

  return (
    <Form action={onPay} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div>
        {cart.length == 0 && <p>Your shopping cart is empty</p>}
        {cart.length > 0 &&
          cart.map((entry, index) => getEntryElement(entry, index))}
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Shipping Address</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded p-2"
          value={address.recipient}
          onChange={(e) =>
            setAddress({ ...address, recipient: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Street"
          className="w-full border rounded p-2"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City"
            className="border rounded p-2"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Country"
            className="border rounded p-2"
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Postal Code"
            className="border rounded p-2"
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Payment Details</h2>
        <input
          type="text"
          placeholder="Cardholder Name"
          className="w-full border rounded p-2"
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Card Number"
          className="w-full border rounded p-2"
          value={card.number}
          onChange={(e) =>
            setCard({
              ...card,
              number:
                z.string().max(16).safeParse(e.target.value.replace(/\D/g, ""))
                  ?.data ?? card.number,
            })
          }
          required
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="MM"
            className="border rounded p-2"
            value={card.expirationMonth}
            onChange={(e) =>
              setCard({
                ...card,
                expirationMonth:
                  z.coerce
                    .number()
                    .min(1)
                    .max(12)
                    .safeParse(
                      Number.parseInt(e.target.value.replace(/\D/g, "")),
                    )?.data ?? card.expirationMonth,
              })
            }
            required
          />
          <input
            type="number"
            placeholder="YY"
            className="border rounded p-2"
            value={card.expirationYear}
            onChange={(e) =>
              setCard({
                ...card,
                expirationYear: e.target.value.startsWith("-")
                  ? card.expirationYear
                  : (z.coerce
                      .number()
                      .min(0)
                      .max(99)
                      .safeParse(
                        Number.parseInt(e.target.value.replace(/()-|\D/g, "")),
                      )?.data ?? card.expirationYear),
              })
            }
            required
          />
          <input
            type="text"
            placeholder="CVC"
            className="border rounded p-2"
            value={card.code}
            onChange={(e) =>
              setCard({
                ...card,
                code:
                  z.string().max(4).safeParse(e.target.value.replace(/\D/g, ""))
                    ?.data ?? card.code,
              })
            }
            required
          />
        </div>
      </div>

      <div className="text-right font-semibold">Shipping: {shippingPrice}</div>

      <Button
        type="submit"
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
      >
        <CreditCardIcon className="size-5" />
        Pay
      </Button>
    </Form>
  );
}
