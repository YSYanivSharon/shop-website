"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { PurchaseEntry, ShopItem, CustomDuck, CreditCardDetails } from "@/lib/types";
import { getCart, clearCart } from "@/app/components/shopping-cart";
import { getShopItem, getShippingPrice, pay } from "@/lib/persist-module";
import { getImageOfItem, getImageOfCustomDuck } from "@/app/components/item-images";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<PurchaseEntry[]>([]);
  const [customDuckPrice, setCustomDuckPrice] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setCart(getCart());
      const item = await getShopItem(0);
      setCustomDuckPrice(item.price);
    }
    if (!mounted) {
      load();
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    async function loadShipping() {
      if (country) {
        const p = await getShippingPrice(country);
        setShippingPrice(p);
      } else {
        setShippingPrice(null);
      }
    }
    loadShipping();
  }, [country]);

  function validateFullName(name: string): string {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters";
    if (!/^[a-zA-Z\s\u0590-\u05FF]+$/.test(name.trim())) return "Full name can only contain letters and spaces";
    return "";
  }

  function validateEmail(email: string): string {
    if (!email.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address";
    return "";
  }

  function validatePhone(phone: string): string {
    if (!phone.trim()) return "Phone number is required";
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) return "Phone number must be at least 9 digits";
    if (digitsOnly.length > 15) return "Phone number cannot exceed 15 digits";
    return "";
  }

  function validateStreet(street: string): string {
    if (!street.trim()) return "Street address is required";
    if (street.trim().length < 3) return "Street address must be at least 3 characters";
    return "";
  }

  function validateHouseNumber(houseNumber: string): string {
    if (!houseNumber.trim()) return "House/apartment number is required";
    return "";
  }

  function validateCardNumber(cardNumber: string): string {
    if (!cardNumber.trim()) return "Card number is required";
    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (!/^\d+$/.test(cleanCard)) return "Card number can only contain digits";
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      return "Card number must be between 13-19 digits";
    }

    let sum = 0;
    let isEven = false;
    for (let i = cleanCard.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCard[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    if (sum % 10 !== 0) return "Please enter a valid card number";
    return "";
  }

  function validateExpiry(expiry: string): string {
    if (!expiry.trim()) return "Expiry date is required";
    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) return "Expiry must be in MM/YY format";

    const [mmStr, yyStr] = expiry.split("/");
    const mm = Number(mmStr);
    const yy = Number(yyStr);

    if (mm < 1 || mm > 12) return "Invalid month (01-12)";

    const now = new Date();
    const currentYear = Number(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1;

    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      return "Card has expired";
    }

    return "";
  }

  function validateCvv(cvv: string): string {
    if (!cvv.trim()) return "CVV is required";
    if (!/^\d{3,4}$/.test(cvv.trim())) return "CVV must be 3-4 digits";
    return "";
  }

  function clearError(field: string) {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function formatCardNumber(value: string): string {
    const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleanValue.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleanValue;
    }
  }

  function formatExpiry(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + (cleanValue.length > 2 ? '/' + cleanValue.substring(2, 4) : '');
    }
    return cleanValue;
  }

  function renderEntry(entry: PurchaseEntry, index: number) {
    const isCustom = entry.item.id=== 0;
    const unitPrice = isCustom ? customDuckPrice : (entry.item as ShopItem).price;
    const name = isCustom ? "Custom Duck" : (entry.item as ShopItem).name;
    const image = isCustom
      ? getImageOfCustomDuck(entry.item as CustomDuck)
      : getImageOfItem(entry.item as ShopItem);

    return (
      <div
        key={index}
        className="flex items-center justify-between bg-white dark:bg-slate-900 shadow rounded-xl p-4 mb-3"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex items-center justify-center">{image}</div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{name}</p>
            <p className="text-slate-600 dark:text-slate-300">₪{unitPrice} × {entry.count}</p>
          </div>
        </div>
        <p className="font-bold text-slate-900 dark:text-slate-100">₪{unitPrice * entry.count}</p>
      </div>
    );
  }

  let total = 0;
  for (const e of cart) {
    const price = e.item.id === 0 ? customDuckPrice : (e.item as ShopItem).price;
    total+= price * e.count;
  }

  async function onPay() {
    setMessage("");
    setErrors({});

    const newErrors: {[key: string]: string} = {};

    const nameError = validateFullName(fullName);
    if (nameError) newErrors.fullName = nameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!country) newErrors.country = "Please select a country";

    const streetError = validateStreet(street);
    if (streetError) newErrors.street = streetError;

    const houseError = validateHouseNumber(houseNumber);
    if (houseError) newErrors.houseNumber = houseError;

    const cardError = validateCardNumber(cardNumber);
    if (cardError) newErrors.cardNumber = cardError;

    const expiryError = validateExpiry(expiry);
    if (expiryError) newErrors.expiry = expiryError;

    const cvvError = validateCvv(cvv);
    if (cvvError) newErrors.cvv = cvvError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("Please fix the errors above and try again.");
      return;
    }

    const creditCardDetails: CreditCardDetails = {
      cardNumber: cardNumber.replace(/\s+/g, ""),
      expiry,
      cvv
    };
    const address = `${street} ${houseNumber}, ${country}`;

    try {
      const successful = await pay(cart, address, creditCardDetails);

      if (successful) {
        clearCart();
        const orderId = Math.floor(100000 + Math.random() * 900000);
        if (typeof window !== "undefined") {
          const lastOrder = {
            orderId,
            total,
            name: fullName,
            country,
            street,
            house: houseNumber,
            items: cart,
          };
          sessionStorage.setItem("lastOrder", JSON.stringify(lastOrder));
        }
        router.push(
          `/shop/checkout/confirmation?orderId=${orderId}&total=${total}` +
            `&name=${encodeURIComponent(fullName)}` +
            `&country=${encodeURIComponent(country)}` +
            `&street=${encodeURIComponent(street)}` +
            `&house=${encodeURIComponent(houseNumber)}`
        );
      } else {
        setMessage("Payment failed. Please check your payment details and try again.");
      }
    } catch (error) {
      setMessage("An error occurred while processing your payment. Please try again.");
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">Checkout</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${
          message.includes("failed") || message.includes("error") || message.includes("fix")
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-green-100 text-green-700 border border-green-300"
        }`}>
          {message}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Order Summary</h2>
        {cart.map((entry, i) => renderEntry(entry, i))}
        <div className="flex justify-between border-t pt-4 mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
          <span>Total:</span>
          <span>₪{total}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Shipping: {shippingPrice !== null ? `₪${shippingPrice}` : "TBD"}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Shipping Information</h2>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError('fullName');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.fullName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError('email');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-3">
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError('phone');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="mb-3">
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              clearError('country');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.country ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            <option value="Israel">Israel</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => {
              setStreet(e.target.value);
              clearError('street');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.street ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="House / Apartment Number"
            value={houseNumber}
            onChange={(e) => {
              setHouseNumber(e.target.value);
              clearError('houseNumber');
            }}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.houseNumber ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Payment Details</h2>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);
              clearError('cardNumber');
            }}
            maxLength={19}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.cardNumber ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChange={(e) => {
              const formatted = formatExpiry(e.target.value);
              setExpiry(formatted);
              clearError('expiry');
            }}
            maxLength={5}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.expiry ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCvv(value);
              clearError('cvv');
            }}
            maxLength={4}
            className={`w-full border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.cvv ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300'
            }`}
          />
          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <Link
        href="#"
        onClick={onPay}
        className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl shadow-md transition-colors"
      >
        <CreditCardIcon className="h-6 w-6 mr-2" />
        Pay Now
      </Link>
    </main>
  );
}