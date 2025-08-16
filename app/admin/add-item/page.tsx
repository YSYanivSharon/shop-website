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

  const comboboxItemTypes: ComboboxEntry[] = Object.entries(ItemType)
    .filter(([key, _]) => {
      return !isNaN(Number(key));
    })
    .map(([key, value]) => {
      return { id: Number(key), name: value } as ComboboxEntry;
    });

  console.log(comboboxItemTypes);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image) {
      const result = await addShopItem(name, price, itemType, image);

      if (typeof result === "string") {
        // TODO: Handle signup fails
      } else {
      }
    } else {
      // TODO: Handle missing image
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input name="name" onChange={(e) => setName((_) => e.target.value)} />
          <br />
          <input
            name="price"
            type="number"
            onChange={(e) => setPrice((_) => Number.parseFloat(e.target.value))}
          />
          <br />
          <Combobox
            value={comboboxItemTypes[itemType]}
            onChange={(selected) => setItemType(selected?.id as ItemType)}
          >
            <ComboboxButton className=" flex texflex w-100 rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white">
              {comboboxItemTypes[itemType].name}
              <ChevronDownIcon className="justify-end size-4 fill-white/60 group-data-hover:fill-white" />
            </ComboboxButton>
            <ComboboxOptions anchor="bottom start">
              {comboboxItemTypes.map((itemType) => (
                <ComboboxOption key={itemType.id} value={itemType}>
                  {itemType.name}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
          <br />
          <input
            name="image"
            type="file"
            accept="image/png"
            onChange={(e) => setImage((_) => e.target.files?.item(0) ?? null)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
