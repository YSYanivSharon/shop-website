"use client";

import { useEffect, useState, useContext } from "react";
import { getImageOfCustomDuck } from "@/app/components/item-images";
import { CustomDuck, CustomDuckPartsCatalog, User } from "@/lib/types";
import { getDuckParts } from "@/lib/persist-module";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import { addCustomDuckToCart } from "@/app/components/shopping-cart";
import { UserContext, tryAddItemToWishlist, tryRemoveItemFromWishlist } from "@/app/components/user-provider";

export default function Page() {
  const [partsCatalog, setPartsCatalog] = useState<CustomDuckPartsCatalog | null>(null);
  const [pickedColor, setPickedColor] = useState<number>(0);
  const [pickedHead, setPickedHead] = useState<number>(0);
  const [pickedBody, setPickedBody] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  const user = useContext(UserContext) as User | null;
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const loadParts = async () => {
      setPartsCatalog(await getDuckParts());
    };
    if (!partsCatalog) loadParts();
  }, [partsCatalog]);

  function getCustomDuck() {
    return {
      color: partsCatalog?.colors[pickedColor],
      head: partsCatalog?.heads[pickedHead],
      body: partsCatalog?.bodies[pickedBody],
    } as CustomDuck;
  }

  function rotateRight(value: number, valueCount: number, setter: React.Dispatch<React.SetStateAction<number>>) {
    setter(value + 1 >= valueCount ? 0 : value + 1);
  }

  function rotateLeft(value: number, valueCount: number, setter: React.Dispatch<React.SetStateAction<number>>) {
    setter(value - 1 < 0 ? valueCount - 1 : value - 1);
  }

  function handleAddToCart() {
    if (!partsCatalog) return;
    addCustomDuckToCart(
      partsCatalog.colors[pickedColor],
      partsCatalog.heads[pickedHead],
      partsCatalog.bodies[pickedBody],
    );
    setMessage("Your custom duck was added to the cart!");
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="items-center justify-center flex flex-col w-full p-6">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-yellow-500 mb-3">
          Build Your Duck
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Create your own custom duck! Mix and match colors, <br />
          heads, and bodies to design the perfect duck friend for your collection.<br />
        </p>
      </div>

      {!partsCatalog && <p>Loading...</p>}

      {partsCatalog &&
        partsCatalog.colors.length > 0 &&
        partsCatalog.heads.length > 0 &&
        partsCatalog.bodies.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full max-w-[700px]">
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col gap-2">
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateLeft(pickedHead, partsCatalog.heads.length, setPickedHead)}
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateLeft(pickedColor, partsCatalog.colors.length, setPickedColor)}
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateLeft(pickedBody, partsCatalog.bodies.length, setPickedBody)}
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
              </div>

              {getImageOfCustomDuck(getCustomDuck())}

              <div className="flex flex-col gap-2">
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateRight(pickedHead, partsCatalog.heads.length, setPickedHead)}
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateRight(pickedColor, partsCatalog.colors.length, setPickedColor)}
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => rotateRight(pickedBody, partsCatalog.bodies.length, setPickedBody)}
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                className="flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Add to Cart
              </Button>

            </div>
          </div>
        )}

      {message && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {message}
        </div>
      )}
    </div>
  );
}