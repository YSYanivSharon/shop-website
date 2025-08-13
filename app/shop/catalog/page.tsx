"use client";

import Image from "next/image";
import Link from "next/link";
import { ShopItem, getCatalog } from "@/lib/persist-module";
import { useEffect, useState } from "react";

export default function Page() {
  const [catalog, setCatalog] = useState<ShopItem[]>([]);

  useEffect(() => {
    const get = async () => {
      try {
        setCatalog(await getCatalog());
      } catch (e) {}
    };

    get();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        Choose your Duck
      </h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {catalog.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
          >
            <Link href={`/shop/item/${item.id}`}>
              <Image
                src={`/item-images/${item.id}.png`}
                alt={item.name}
                width={200}
                height={200}
                className="mx-auto mb-3 rounded"
              />
            </Link>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {item.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">₪{item.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
