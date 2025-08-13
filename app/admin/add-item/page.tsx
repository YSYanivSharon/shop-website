"use client";

import { FormEvent, useState, useContext } from "react";
import { addShopItem, ItemType, ShopItem } from "@/lib/persist-module";
import { Combobox } from "@headlessui/react";

export default function Page() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<ItemType>(ItemType.Duck);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await addShopItem(name, price, type, image);

    if (typeof result === "string") {
      // TODO: Handle signup fails
    } else {
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input name="name" onChange={(e) => setName((_) => e.target.value)} />
          <input
            name="price"
            type="number"
            onChange={(e) => setPrice((_) => Number.parseFloat(e.target.value))}
          />
          <Combobox onChange={(e) => setType((_) => e.target.value)} />
          <input
            name="image"
            type="file"
            onChange={(e) => setImage((_) => e.target.files?.item(0) ?? null)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
