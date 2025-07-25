"use client";

import { ShoppingCart, ShoppingBag, Tool } from '@geist-ui/icons';
import { Spacer } from '@geist-ui/core';
import Link from 'next/link'

export default function ShopHeader() {
  return (
    <header className='sticky top-0 z-50 shadow'>
      <nav className="border-b shadow">
        <div className='flex items-center justify-between'>
          <div className='flex'>
            <Link href="/shop/catalog" className="flex text-white font-semibold py-1 px-6 transition">
              <ShoppingBag />
              <Spacer w={0.25} />
              Catalog
            </Link>
            <div className="w-px bg-white" />
            <Link href="/shop/build-a-duck" className="flex text-white font-semibold py-1 px-6 transition">
              <Tool />
              <Spacer w={0.25} />
              Build-a-Duck
            </Link>
            <div className="w-px bg-white" />
          </div>
          <div className='flex justify-end'>
            <div className="w-px bg-white" />
            <Link href="/shop/cart" className="flex text-white font-semibold py-1 px-6 transition">
              <ShoppingCart />
              <Spacer w={0.25} />
              Cart
            </Link>
            <Spacer w={1} />
          </div>
        </div>
      </nav>
    </header>
  );
}
