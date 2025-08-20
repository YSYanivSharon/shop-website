"use client";

import { use, useEffect, useState } from "react";
import { ShopItem, getShopItem } from "@/lib/persist-module";
import Image from "next/image";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    const getItem = async () => {
      try {
        setItem(await getShopItem(id));
      } catch (e) {
        console.error(e);
      }
    };

    getItem();
  }, [id]);

  if (!item) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        {/* Duck image */}
        <Image
          src={`/item-images/${item.id}.png`}
          alt={item.name}
          width={350}
          height={350}
          className="rounded-lg shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          <p className="text-xl text-yellow-700 dark:text-yellow-300 mb-4">
            ₪{item.price}
          </p>
        </div>
      </div>
    </main>
  );
}
