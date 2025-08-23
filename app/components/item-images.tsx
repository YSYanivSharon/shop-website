"use client";

import { CustomDuck, ShopItem } from "@/lib/types";
import Image from "next/image";

export function getImageOfItem(item: ShopItem) {
  return (
    <Image
      src={`/item-images/${item.id}.png`}
      alt={item.name}
      width={200}
      height={200}
      className="mx-auto mb-3 rounded"
    />
  );
}

export function getImageOfCustomDuck(customDuck: CustomDuck) {
  return (
    <div>
      <Image
        src={`/item-images/${customDuck.color.id}.png`}
        alt={customDuck.color.name}
        width={200}
        height={200}
        className="mx-auto mb-3 rounded"
      />
      <Image
        src={`/item-images/${customDuck.head.id}.png`}
        alt={customDuck.head.name}
        width={200}
        height={200}
        className="mx-auto mb-3 rounded"
      />
      <Image
        src={`/item-images/${customDuck.body.id}.png`}
        alt={customDuck.body.name}
        width={200}
        height={200}
        className="mx-auto mb-3 rounded"
      />
    </div>
  );
}
