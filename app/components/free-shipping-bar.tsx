"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, TruckIcon } from "@heroicons/react/24/solid";

const BarVisibleStorageKey = "shipping-bar-visible";

export default function FreeShippingBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(
      JSON.parse(localStorage.getItem(BarVisibleStorageKey) ?? "true"),
    );
  });

  function onXClick() {
    localStorage.setItem(BarVisibleStorageKey, "false");
    setIsVisible(false);
  }

  return (
    <div
      hidden={!isVisible}
      className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold sticky top-0 z-40"
    >
      <span className="flex justify-center">
        Free shipping on orders over ₪250!
        <span className="w-1.5" /> <TruckIcon className="size-5" />
      </span>
      <button
        onClick={onXClick}
        className="absolute left-auto right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 text-lg font-bold leading-none"
        aria-label="Close shipping banner"
      >
        <XMarkIcon className="size-6" />
      </button>
    </div>
  );
}
