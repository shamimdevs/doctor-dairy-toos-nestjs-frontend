import React from "react";
import { UserDropdown } from "../UserDropdown/UserDropdown";

interface DNavbarProps {
  onOpenSidebar: () => void;
}

export const DNavbar: React.FC<DNavbarProps> = ({ onOpenSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between z-10">
      <div className="flex items-center md:gap-3 gap-1">
        {/* Hamburger Toggle for Mobile & Tablet */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Open Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h2 className="lg:hidden text-emerald-600 font-semibold">DDT</h2>
      </div>

      <div className="flex items-center gap-4">
        <UserDropdown />
      </div>
    </header>
  );
};
