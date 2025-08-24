"use client";

import { useEffect, useState } from "react";
import { getImageOfCustomDuck } from "@/app/components/item-images";
import { CustomDuck, CustomDuckPartsCatalog } from "@/lib/types";
import { getDuckParts } from "@/lib/persist-module";

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

  return (
    <div>
      {!partsCatalog && <p>Loading</p>}
      {partsCatalog &&
        partsCatalog.colors.length > 0 &&
        partsCatalog.heads.length > 0 &&
        partsCatalog.bodies.length > 0 && (
          <>{getImageOfCustomDuck(getCustomDuck())}</>
        )}
    </div>
  );
}
