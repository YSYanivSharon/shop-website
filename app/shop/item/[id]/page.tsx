"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState, useContext, ChangeEvent } from "react";
import { getShopItem } from "@/lib/persist-module";
import {
  tryAddItemToCart,
  tryAddItemToWishlist,
  tryRemoveItemFromWishlist,
  UserContext,
} from "@/app/components/user-provider";
import { ItemType, ShopItem, User } from "@/lib/types";
import Image from "next/image";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const [mounted, setMounted] = useState(false);
  const { id } = use(params);
  const [item, setItem] = useState<ShopItem | null | undefined>(undefined);
  const [count, setCount] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getItem = async () => {
      try {
        setItem(await getShopItem(id));
      } catch (e) {
        console.error(e);
      }
      setMounted(true);
    };
    getItem();
  }, [id]);

  function onCountChange(e: ChangeEvent<HTMLInputElement>) {
    let newCount = Number.parseInt(e.target.value) ?? 1;
    if (newCount <= 0) newCount = 1;
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

  async function handleAddToCart() {
    if (!user) {
      router.push("/shop/user/login");
      return;
    }

    if (!item) return;

    if (await tryAddItemToCart(item, count)) {
      setMessage(`"${item.name}" has been added to your cart!`);
      setTimeout(() => setMessage(null), 2500);
    } else {
      setMessage(`Failed adding to cart`);
      setTimeout(() => setMessage(null), 2500);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 relative">
      {!mounted && item === undefined && (
        <p className="text-center text-gray-600">Loading...</p>
      )}
      {((mounted && !item) || (item && item?.type != ItemType.Duck)) && (
        <p className="text-center text-red-500">Invalid item</p>
      )}

      {item && item.type == ItemType.Duck && (
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src={`/images/item-images/${item.id}.png`}
              alt={item.name}
              width={350}
              height={350}
              className="rounded-lg shadow-md"
            />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
              {item.name}
            </h1>
            <p className="text-2xl text-yellow-600 font-bold mb-6">
              ₪{item.price}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Meet the amazing{" "}
              <span className="font-semibold">{item.name}</span> – one of Duck
              World’s finest! Perfect for bath time or just to brighten your
              day.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <label className="font-medium dark:text-gray-200">
                Quantity:
              </label>
              <input
                type="number"
                value={count}
                min={1}
                onChange={onCountChange}
                className="w-20 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Add to Cart
              </button>
              {user && (
                <button
                  type="button"
                  onClick={onWishlistToggle}
                  className="flex items-center justify-center w-14 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  {wishlisted ? (
                    <SolidHeartIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <OutlineHeartIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce">
          {message}
        </div>
      )}
    </main>
  );
}
