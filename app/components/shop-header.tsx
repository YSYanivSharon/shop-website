"use client";

import { ShoppingCartIcon, BuildingStorefrontIcon, WrenchScrewdriverIcon, UserIcon, ArchiveBoxIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

export default function ShopHeader() {
  const username = 'John Smith'; // TODO: Put the actual username here. None = not logged in

  return (
    <header className='sticky top-0 z-50 shadow'>
      <nav className="border-b shadow">
        <div className='flex items-center justify-between'>
          <div className='flex'>
            <Link href="/shop/catalog" className="flex text-white font-semibold py-1 px-6 transition">
              <BuildingStorefrontIcon className='size-6' />
              Catalog
            </Link>
            <div className="w-px bg-white" />
            <Link href="/shop/build-a-duck" className="flex text-white font-semibold py-1 px-6 transition">
              <WrenchScrewdriverIcon className='size-6' />
              Build-a-Duck
            </Link>
            <div className="w-px bg-white" />
          </div>
          <div className='flex justify-end'>
            <div className="w-px bg-white" />
            <Link href="/shop/cart" className="flex text-white font-semibold py-1 px-6 transition">
              <ShoppingCartIcon className='size-6' />
              Cart
            </Link>
            <div className="w-px bg-white" />
            {!username && <Link href='/user/login' className='flex texflex text-white font-semibold py-1 px-6 transition'>
              <UserIcon className='size-6' />
              Login
            </Link>}
            {username && <Menu>
              <MenuButton>{username}</MenuButton>
              <MenuItems anchor='bottom'>
                <MenuItem>
                  <Link href='/user/my-items' className='flex texflex text-white font-semibold py-1 px-6 transition'>
                    <ArchiveBoxIcon className='size-6' />
                    My Items
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href='/user/logout' className='flex texflex text-white font-semibold py-1 px-6 transition'>
                    <ArrowRightEndOnRectangleIcon className='size-6' />
                    Logout
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>}
          </div>
        </div>
      </nav>
    </header>
  );
}
