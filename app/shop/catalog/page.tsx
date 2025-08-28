"use client";

import Image from "next/image";
import Link from "next/link";
import { getCatalog } from "@/lib/persist-module";
import { ShopItem } from "@/lib/types";
import { useEffect, useState } from "react";
import { Input } from "@headlessui/react";

export default function Page() {
  const [catalog, setCatalog] = useState<ShopItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-10">
        Choose your Duck
      </h1>
      <div className="flex justify-end mb-5">
        <p>Search:</p>
        <div className="size-2" />
        <Input
          className="bg-gray-200 dark:bg-gray-700 rounded-md"
          value={searchQuery}
          type="text"
          onChange={(e) => {
            setSearchQuery(e?.target.value);
          }}
        />
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {catalog
          .filter((item) =>
            item.name.toLowerCase().startsWith(searchQuery.toLowerCase()),
          )
          .map((item) => (
            <Link
              href={`/shop/item/${item.id}`}
              key={item.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-4 text-center hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={`/images/item-images/${item.id}.png`}
                alt={item.name}
                width={200}
                height={200}
                className="mx-auto mb-3 rounded"
              />
              <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {item.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                ₪{item.price}
              </p>
            </Link>
          ))}
      </div>
    </main>
  );
}
