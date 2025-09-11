"use client";

import { useContext, useEffect, useState } from "react";
import { ShopItem } from "@/lib/types";
import { getShopItem } from "@/lib/persist-module";
import { getImageOfItem } from "@/app/components/item-images";
import { TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { tryRemoveItemFromWishlist, tryAddItemToCart, UserContext } from "@/app/components/user-provider";

export default function WishlistPage() {
  const user = useContext(UserContext);
  const [wishlist, setWishlist] = useState<ShopItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      const ids = user?.wishlist ?? [];
      const items: ShopItem[] = [];
      for (const id of ids) {
        items.push(await getShopItem(id));
      }
      setWishlist(items);
    };
    if (!mounted) {
      loadWishlist();
      setMounted(true);
    }
  }, [mounted, user]);

  async function onRemoveItem(index: number) {
    if (await tryRemoveItemFromWishlist(wishlist[index].id)) {
      setWishlist(wishlist.filter((_, i) => i !== index));
    }
  }

  async function onMoveToCart(index: number) {
    if (await tryAddItemToCart(wishlist[index], 1)) {
      await onRemoveItem(index);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-slate-100">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-lg text-slate-600 dark:text-slate-300">
          Your wishlist is empty. Start exploring the catalog and add some ducks you love!
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {wishlist.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md p-5 flex flex-col items-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-40 h-40 flex items-center justify-center mb-4">
                {getImageOfItem(item)}
              </div>
              <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {item.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-4">₪{item.price}</p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-800/60 text-red-600 dark:text-red-400 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => onMoveToCart(index)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}