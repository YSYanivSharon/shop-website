"use client";

import { use, useEffect, useState, useContext, ChangeEvent } from "react";
import { getShopItem } from "@/lib/persist-module";
import {
  tryAddItemToWishlist,
  tryRemoveItemFromWishlist,
} from "@/app/components/user-provider";

import { ItemType, ShopItem, User } from "@/lib/types";
import Image from "next/image";
import { Button, Input } from "@headlessui/react";
import { addItemToCart } from "@/app/components/shopping-cart";
import { UserContext } from "@/app/components/user-provider";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const [mounted, setMounted] = useState(false);
  const { id } = use(params);
  const [item, setItem] = useState<ShopItem | null | undefined>(undefined);
  const [count, setCount] = useState<number>(1);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  function onCountChange(e: ChangeEvent<HTMLInputElement>) {
    let newCount = Number.parseInt(e.target.value) ?? 1;

    if (newCount <= 0) {
      newCount = 1;
    }

    setCount(newCount);
  }

  const user = useContext(UserContext) as User;
  let wishlisted = false;

  function onWishlistToggle() {
    wishlisted ? tryRemoveItemFromWishlist(id) : tryAddItemToWishlist(id);
  }

  if (user) {
    const wishlist = mounted ? user.wishlist : [];

    wishlisted = mounted && wishlist.includes(id);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {item === undefined && <>Loading</>}
      {(item === null || (item && item?.type != ItemType.Duck)) && (
        <>Invalid item</>
      )}
      {item && item.type == ItemType.Duck && (
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
          This is the item page for:
          <br />
          ID: {item.id}
          <br />
          Name: {item.name}
          <br />
          Price: ₪{item.price}
          <br />
          <Image
            src={`/item-images/${item.id}.png`}
            alt={item.name}
            width={200}
            height={200}
            className="mx-auto mb-3 rounded"
          />
          {user && (
            <Button type="button" onClick={onWishlistToggle}>
              {wishlisted && <SolidHeartIcon className="size-6" />}
              {!wishlisted && <OutlineHeartIcon className="size-6" />}
            </Button>
          )}
          <Button
            type="button"
            onClick={(_) => {
              addItemToCart(item, count);
            }}
          >
            Add to cart
          </Button>
          <Input type="number" value={count} onChange={onCountChange} />
        </div>
      )}
    </main>
  );
}
