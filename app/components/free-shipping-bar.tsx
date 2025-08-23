'use client';

import { useState } from 'react';

export default function FreeShippingBar() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold sticky top-0 z-40 relative">
      <span>Free shipping on orders over ₪250! 🚚</span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute left-auto right-4 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 text-lg font-bold leading-none"
        aria-label="Close shipping banner"
      >
        ×
      </button>
    </div>
  );
}