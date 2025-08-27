"use client";

import { FormEvent, useState, useContext } from "react";
import { addShopItem } from "@/lib/persist-module";
import { ItemType } from "@/lib/types";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

type ComboboxEntry = {
  id: number;
  name: string;
};

export default function Page() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [itemType, setItemType] = useState<ItemType>(ItemType.Duck);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const comboboxItemTypes: ComboboxEntry[] = Object.entries(ItemType)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => ({ id: Number(key), name: value } as ComboboxEntry));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || price < 0 || !image) {
      setMessage("Please enter a non-negative price, name and upload an image.");
      return;
    }

    const result = await addShopItem(name, price, itemType, image);

    if (typeof result === "string") {
      setMessage("Failed to add item. Try again.");
    } else {
      setMessage("Item added successfully!");
      setName("");
      setPrice(0);
      setImage(null);
    }
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 w-full max-w-md mt-20 border border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold text-center text-yellow-500 mb-6">
            Add New Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your duck's name"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Price (₪)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Category
              </label>
              <Combobox
                value={comboboxItemTypes[itemType]}
                onChange={(selected) => setItemType(selected?.id as ItemType)}
              >
                <div className="relative">
                  <ComboboxButton className="flex justify-between w-full rounded-lg border px-4 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    {comboboxItemTypes[itemType].name}
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </ComboboxButton>
                  <ComboboxOptions className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5">
                    {comboboxItemTypes.map((itemType) => (
                      <ComboboxOption
                        key={itemType.id}
                        value={itemType}
                        className="cursor-pointer px-4 py-2 hover:bg-yellow-100 dark:hover:bg-gray-700"
                      >
                        {itemType.name}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </div>
              </Combobox>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Upload Image
              </label>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gray-200 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Choose File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
                {image&& (
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                    {image.name}
                  </span>
                )}

                <button
                  type="submit"
                  className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>

          {message && (
            <p className="text-center mt-4 text-sm font-medium text-red-500 dark:text-red-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}