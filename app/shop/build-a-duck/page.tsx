"use client";

import { useEffect, useState } from "react";
import { getImageOfCustomDuck } from "@/app/components/item-images";
import { CustomDuck, CustomDuckPartsCatalog } from "@/lib/types";
import { getDuckParts } from "@/lib/persist-module";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@headlessui/react";
import { addCustomDuckToCart } from "@/app/components/shopping-cart";

export default function Page() {
  const [partsCatalog, setPartsCatalog] =
    useState<CustomDuckPartsCatalog | null>(null);
  const [pickedColor, setPickedColor] = useState<number>(0);
  const [pickedHead, setPickedHead] = useState<number>(0);
  const [pickedBody, setPickedBody] = useState<number>(0);

  useEffect(() => {
    const loadParts = async () => {
      setPartsCatalog(await getDuckParts());
    };

    if (!partsCatalog) loadParts();
  });

  function getCustomDuck() {
    return {
      color: partsCatalog?.colors[pickedColor],
      head: partsCatalog?.heads[pickedHead],
      body: partsCatalog?.bodies[pickedBody],
    } as CustomDuck;
  }

  function rotateRight(
    value: number,
    valueCount: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) {
    setter(value + 1 >= valueCount ? 0 : value + 1);
  }

  function rotateLeft(
    value: number,
    valueCount: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) {
    setter(value - 1 < 0 ? valueCount - 1 : value - 1);
  }

  return (
    <div className="items-center justify-center flex">
      {!partsCatalog && <p>Loading</p>}
      {partsCatalog &&
        partsCatalog.colors.length > 0 &&
        partsCatalog.heads.length > 0 &&
        partsCatalog.bodies.length > 0 && (
          <div className="flex flex-col items-center justify-center w-full max-w-[700px]">
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col gap-2">
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateLeft(
                      pickedHead,
                      partsCatalog.heads.length,
                      setPickedHead,
                    )
                  }
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateLeft(
                      pickedColor,
                      partsCatalog.colors.length,
                      setPickedColor,
                    )
                  }
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateLeft(
                      pickedBody,
                      partsCatalog.bodies.length,
                      setPickedBody,
                    )
                  }
                >
                  <ChevronLeftIcon className="size-10" />
                </Button>
              </div>
              {getImageOfCustomDuck(getCustomDuck())}
              <div className="flex flex-col gap-2">
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateRight(
                      pickedHead,
                      partsCatalog.heads.length,
                      setPickedHead,
                    )
                  }
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateRight(
                      pickedColor,
                      partsCatalog.colors.length,
                      setPickedColor,
                    )
                  }
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
                <Button
                  className="px-7 py-10 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() =>
                    rotateRight(
                      pickedBody,
                      partsCatalog.bodies.length,
                      setPickedBody,
                    )
                  }
                >
                  <ChevronRightIcon className="size-10" />
                </Button>
              </div>
            </div>

            <Button
              className="px-8 py-4 text-lg font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-lg"
              onClick={() =>
                addCustomDuckToCart(
                  partsCatalog.colors[pickedColor],
                  partsCatalog.heads[pickedHead],
                  partsCatalog.bodies[pickedBody],
                )
              }
            >
              Add to Cart
            </Button>
          </div>
        )}
    </div>
  );
}
