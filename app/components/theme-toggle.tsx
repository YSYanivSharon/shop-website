import { Switch } from '@headlessui/react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useState, useEffect } from 'react'

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = useState(theme == 'dark')

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null
  }

  function onChange(set: boolean) {
    setEnabled(set);
    setTheme(set ? 'dark' : 'light')
  }

  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full p-1 ease-in-out focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white bg-gray-300 data-checked:bg-gray-700"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-0 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
      >
        {enabled && <MoonIcon className='size-5' />}
        {!enabled && <SunIcon className='size-5' />}
      </span>
    </Switch>
  )
}
