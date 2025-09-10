"use client";

import z from "zod";
import { useState, useEffect, useContext } from "react";
import { PurchaseEntry, ShopItem, CustomDuck, Address, CreditCardDetails } from "@/lib/types";
import { getShippingPrice, getShopItem } from "@/lib/persist-module";
import { UserContext, tryPay } from "@/app/components/user-provider";
import { getImageOfCustomDuck, getImageOfItem } from "@/app/components/item-images";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [address, setAddress] = useState<Omit<Address, "postalCode">>({
    street: "",
    city: "",
    country: "",
    recipient: "",
  });
  const [card, setCard] = useState<CreditCardDetails>({
    number: "",
    name: "",
    code: "",
    expirationMonth: new Date().getMonth() + 1,
    expirationYear: new Date().getFullYear() % 100,
  });
  const [shippingPrice, setShippingPrice] = useState<number | string>("TBD");
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [message, setMessage] = useState("");
  const user = useContext(UserContext);
  const cart = mounted ? (user?.cart ?? []) : [];

  useEffect(() => {
    const loadPrice = async () => setCustomDuckPrice((await getShopItem(0)).price);
    if (!mounted) {
      loadPrice();
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    const updateShipping = async () => setShippingPrice(await getShippingPrice(address as Address));
    updateShipping();
  }, [address]);

  function renderEntry(entry: PurchaseEntry, index: number) {
    const isCustom = entry.item.id === 0;
    const unitPrice = isCustom ? customDuckPrice : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const image = isCustom ? getImageOfCustomDuck(entry.item as CustomDuck) : getImageOfItem(entry.item as ShopItem);

    return (
      <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-900 shadow rounded-xl p-4 mb-3">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">{image}</div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
            <p className="text-slate-600 dark:text-slate-300">₪{unitPrice} × {entry.count}</p>
          </div>
        </div>
        <p className="font-bold text-slate-900 dark:text-slate-100">₪{unitPrice * entry.count}</p>
      </div>
    );
  }

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const schema = z.object({
      recipient: z.string().nonempty("Full name is required"),
      street: z.string().nonempty("Street is required"),
      city: z.string().nonempty("City is required"),
      country: z.string().nonempty("Country is required"),
      name: z.string().nonempty("Cardholder name is required"),
      number: z.string().regex(/^\d+$/, "Card number must contain only digits"),
      code: z.string().regex(/^\d{3,4}$/, "CVC must be 3–4 digits"),
      expirationMonth: z.number().min(1).max(12),
      expirationYear: z.number().min(0).max(99),
    });

    const parsed = schema.safeParse({ ...address, ...card });

    if (!parsed.success) {
      const errs: { [k: string]: string } = {};
      parsed.error.errors.forEach((er) => {
        errs[er.path[0] as string] = er.message;
      });
      setErrors(errs);
      setMessage("Some fields are invalid. Please check and try again.");
      return;
    }

    const successful = await tryPay(address as Address, card);
    if (successful) {
      router.push("/shop/post-payment");
    } else {
      setMessage("Payment failed. Please check your details and try again.");
    }
  }

  const total = cart.reduce((sum, e) => {
    const price = e.item.id === 0 ? customDuckPrice : (e.item as ShopItem).price;
    return sum + price * e.count;
  }, 0);

  return (
    <form onSubmit={onPay} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Checkout</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${
          message.includes("invalid") || message.includes("failed")
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          {message}
        </div>
      )}

      <div>
        {cart.length === 0 && <p>Your shopping cart is empty</p>}
        {cart.length > 0 && cart.map((entry, index) => renderEntry(entry, index))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Shipping Address</h2>
        <input type="text" placeholder="Recipient Full Name" className="w-full border rounded p-2"
          value={address.recipient} onChange={(e) => setAddress({ ...address, recipient: e.target.value })}/>
        {errors.recipient && <p className="text-red-500 text-sm">{errors.recipient}</p>}

        <input type="text" placeholder="Street" className="w-full border rounded p-2"
          value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
        {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}

        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder="City" className="border rounded p-2"
            value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}/>
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <input type="text" placeholder="Country" className="border rounded p-2"
            value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}/>
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow space-y-3">
        <h2 className="text-lg font-semibold">Payment Details</h2>
        <input type="text" placeholder="Cardholder Name" className="w-full border rounded p-2"
          value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}/>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input type="text" placeholder="Card Number" className="w-full border rounded p-2"
          value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "") })}/>
        {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}

        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="MM" className="border rounded p-2"
            value={card.expirationMonth} onChange={(e) => setCard({ ...card, expirationMonth: Number(e.target.value) })}/>
          {errors.expirationMonth && <p className="text-red-500 text-sm">{errors.expirationMonth}</p>}

          <input type="number" placeholder="YY" className="border rounded p-2"
            value={card.expirationYear} onChange={(e) => setCard({ ...card, expirationYear: Number(e.target.value) })}/>
          {errors.expirationYear && <p className="text-red-500 text-sm">{errors.expirationYear}</p>}

          <input type="text" placeholder="CVC" className="border rounded p-2"
            value={card.code} onChange={(e) => setCard({ ...card, code: e.target.value.replace(/\D/g, "") })}/>
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>
      </div>

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Shipping:</span>
        <span>{shippingPrice}</span>
      </div>

      <div className="flex justify-between items-center text-xl font-bold">
        <span>Total:</span>
        <span>₪{total}</span>
      </div>

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition-colors">
        <CreditCardIcon className="h-5 w-5" />
        Pay
      </button>
    </form>
  );
}