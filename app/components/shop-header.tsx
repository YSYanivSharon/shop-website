'use client';

import {
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ArchiveBoxIcon,
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ThemeToggle } from '../components/theme-toggle';

export default function ShopHeader() {
  const username = 'John Smith'; // TODO: Put the actual username here. None = not logged in

  return (
    <header className='sticky top-0 z-50 shadow bg-white dark:bg-black'>
      <nav className='border-b shadow'>
        <div className='flex items-center justify-between'>
          <div className='flex'>
            <Link href='/' className='flex font-semibold py-1 px-6 transition'>
              <HomeIcon className='size-6' />
              Home
            </Link>
            <div className='w-px border' />

            <Link href='/shop/catalog' className='flex font-semibold py-1 px-6 transition'>
              <BuildingStorefrontIcon className='size-6' />
              Catalog
            </Link>
            <div className='w-px border' />

            <Link href='/shop/build-a-duck' className='flex font-semibold py-1 px-6 transition'>
              <WrenchScrewdriverIcon className='size-6' />
              Build-a-Duck
            </Link>
            <div className='w-px border' />

            <Link href='/shop/contactus' className='flex font-semibold py-1 px-6 transition'>
              <PhoneIcon className='size-6' />
              Contact Us
            </Link>
            <div className='w-px border' />
          </div>

          <div className='flex justify-end'>
            <div className='w-px border' />

            <Link href='/shop/cart' className='flex font-semibold py-1 px-6 transition'>
              <ShoppingCartIcon className='size-6' />
              Cart
            </Link>
            <div className='w-px border' />

            {!username && (
              <Link href='/user/login' className='flex font-semibold py-1 px-6 transition'>
                <UserIcon className='size-6' />
                Login
              </Link>
            )}

            {username && (
              <Menu>
                <MenuButton>{username}</MenuButton>
                <MenuItems anchor='bottom' className='border rounded-b-lg'>
                  <MenuItem>
                    <Link href='/user/my-items' className='flex font-semibold py-1 px-6 transition border'>
                      <ArchiveBoxIcon className='size-6' />
                      My Items
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href='/user/logout' className='flex font-semibold py-1 px-6 transition border'>
                      <ArrowRightEndOnRectangleIcon className='size-6' />
                      Logout
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}

            <div className='w-px border' />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
