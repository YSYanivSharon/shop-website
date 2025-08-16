"use client";

import { use, useEffect, useState } from "react";
import { ShopItem, getShopItem } from "@/lib/persist-module";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    const getItem = async () => {
      try {
        setItem(await getShopItem(id));
      } catch (e) {}
    };

    getItem();
  }, []);

  return (
    <div>
      This is the item page for {item?.id}
      {item?.name}
      {item?.price}
    </div>
  );
}
