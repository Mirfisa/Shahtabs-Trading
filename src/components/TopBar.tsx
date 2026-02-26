import React from 'react';
import { Smartphone } from 'lucide-react';

/**
 * TopBar Component
 * This component renders the very top black bar with contact info and social media links.
 */
const TopBar = () => {
  return (
    <nav className="w-full bg-[#f3f2f3] text-grey-900">
      <div className="container mx-auto px-6 py-2">
        {/* Contact Info */}
        <div className="flex items-center gap-1.5">
          <Smartphone size={16} className="text-gray-900" />
          <span className="text-xs sm:text-sm text-gray-900 font-medium leading-none mt-[2px]">
            WhatsApp +88 018-11030303
            {/* Note: The image shows the number repeated, but I'm using a single instance for clarity. */}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
export { }
