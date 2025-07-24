"use client";

import { ShoppingCart } from '@geist-ui/icons';
import { Button, Spacer } from '@geist-ui/core';

export default function ShopHeader() {
  return (
    <header className='sticky top-0 z-50 shadow'>
      <nav className="border">
        <div className='flex items-center justify-between'>
          <div className='flex'>
            This is the header, need to add tabs for the store
          </div>
          <div className='flex justify-end'>
            <Button ghost shadow icon={<ShoppingCart />}>Cart</Button>
            <Spacer w={1} />
          </div>
        </div>
      </nav>
    </header>
  );
}
