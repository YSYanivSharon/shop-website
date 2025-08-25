"use client";

import { CustomDuck, ShopItem } from "@/lib/types";
import Image from "next/image";

export function getImageOfItem(item: ShopItem) {
  return (
    <Image
      src={`/item-images/${item.id}.png`}
      alt={item.name}
      className="mx-auto mb-3 rounded aspect-square w-1 max-w-[500px] min-w-[100px]"
    />
  );
}

export function getImageOfCustomDuck(customDuck: CustomDuck) {
  return (
    <div
      className={
        "relative mx-auto aspect-square w-full max-w-[500px] min-w-[100px]"
      }
    >
      <Image
        src={`/item-images/${customDuck.color.id}.png`}
        alt={customDuck.color.name}
        fill
        className="absolute top-0 left-0 rounded object-contain"
      />
      <Image
        src={`/item-images/${customDuck.head.id}.png`}
        alt={customDuck.head.name}
        fill
        className="absolute top-0 left-0 rounded object-contain"
      />
      <Image
        src={`/item-images/${customDuck.body.id}.png`}
        alt={customDuck.body.name}
        fill
        className="absolute top-0 left-0 rounded object-contain"
      />
    </div>
  );
}
