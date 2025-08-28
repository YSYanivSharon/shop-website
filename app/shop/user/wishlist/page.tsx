"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "@headlessui/react";
import { ShopItem } from "@/lib/types";
import { getShopItem } from "@/lib/persist-module";
import { getImageOfItem } from "@/app/components/item-images";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/solid";
import { tryRemoveItemFromWishlist } from "@/app/components/user-provider";
import { UserContext } from "@/app/components/user-provider";
import { addItemToCart } from "@/app/components/shopping-cart";

export default function Page() {
  const user = useContext(UserContext);
  const [wishlist, setWishlist] = useState<ShopItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadWishlist = async function () {
      var loadedWishlist = [];
      const idWishlist = user?.wishlist ?? [];

      for (var id of idWishlist) {
        loadedWishlist.push(await getShopItem(id));
      }

      setWishlist(loadedWishlist);
    };

    if (!mounted) {
      loadWishlist();
      setMounted(true);
    }
  });

  async function onRemoveItem(index: number) {
    if (await tryRemoveItemFromWishlist(wishlist[index].id)) {
      setWishlist(wishlist.filter((_, i) => i != index));
    }
  }

  async function onMoveToCart(index: number) {
    addItemToCart(wishlist[index], 1);
    await onRemoveItem(index);
  }

  function getItemElement(item: ShopItem, index: number) {
    return (
      <div key={index}>
        <div>Position: {index + 1}</div>
        <div>
          {getImageOfItem(item)}
          <p>{item.name}</p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => {
              onRemoveItem(index);
            }}
          >
            <TrashIcon className="size-6" />
          </Button>
          <Button
            type="button"
            onClick={() => {
              onMoveToCart(index);
            }}
          >
            <ShoppingCartIcon className="size-6" />
            Move to cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {wishlist.length == 0 && <p>The wishlist is empty</p>}
      {wishlist.length > 0 && (
        <>
          <div>
            {wishlist.map((item, index) => getItemElement(item, index))}
          </div>
        </>
      )}
    </div>
  );
}
