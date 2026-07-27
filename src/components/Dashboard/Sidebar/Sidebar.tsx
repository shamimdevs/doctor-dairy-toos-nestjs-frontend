import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  active: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems: MenuItem[] = [
    { label: "Dashboard", active: true },
    { label: "Analytics", active: false },
    { label: "Projects", active: false },
    { label: "Settings", active: false },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform transition-transform duration-200 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <span className="md:font-bold md:text-xl text-base font-semibold text-emerald-600">
          DDT Dashboard
        </span>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1 focus:outline-none"
          aria-label="Close Sidebar"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems?.map((item, idx) => (
          <a
            key={idx}
            href="#"
            onClick={onClose}
            className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-gray-100 text-gray-900 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
