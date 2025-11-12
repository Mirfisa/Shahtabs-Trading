import React from 'react';
import { Smartphone} from 'lucide-react';

/**
 * TopBar Component
 * This component renders the very top black bar with contact info and social media links.
 */
const TopBar = () => {
  return (
    <nav className="w-full bg-[#f3f2f3] text-grey-900 px-4 sm:px-6 py-2 dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        
        {/* Left Side: Contact Info */}
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-gray-900 dark:text-white" />
          <span className="text-xs sm:text-sm text-gray-900 font-medium dark:text-white">
            WhatsApp +88 018-11030303
            {/* Note: The image shows the number repeated, but I'm using a single instance for clarity. */}
          </span>
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-900 hover:text-white transition-colors duration-200">
            <img src="/icons/fb.png" alt="" className="social-icon" />
          </a>
          <a href="#" aria-label="Twitter" className="text-gray-900 hover:text-white transition-colors duration-200">
            <img src="/icons/twitter.png" alt="" className="social-icon" />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-gray-900 hover:text-white transition-colors duration-200">
            <img src="/icons/linkedin.png" alt="" className="social-icon" />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-900 hover:text-white transition-colors duration-200">
            <img src="/icons/insta.png" alt="" className="social-icon" />
          </a>
        </div>

      </div>
    </nav>
  );
};

export default TopBar;
export {}