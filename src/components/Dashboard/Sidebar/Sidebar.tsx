"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Settings,
  ChevronDown,
  User,
  CreditCard,
  List,
  Clock,
  Archive,
  X,
  type LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Projects",
    icon: FolderKanban,
    children: [
      { label: "All Projects", href: "/projects", icon: List },
      { label: "Active", href: "/projects/active", icon: Clock },
      { label: "Archived", href: "/projects/archived", icon: Archive },
    ],
  },
  {
    label: "Product   Category",
    icon: FolderKanban,
    children: [
      {
        label: "Products  Category",
        href: "/dashboard/product-category/all-product-category",
        icon: List,
      },
      {
        label: "Products",
        href: "/dashboard/products/all-products",
        icon: Clock,
      },
    ],
  },
  {
    label: "Video Gallary",
    icon: Settings,
    children: [
      {
        label: "Video Gallary Category",
        href: "/dashboard/video-gallary-category/all-video-gallary-categories",
        icon: User,
      },

      {
        label: "Video Gallaries",
        href: "/dashboard/video-gallaries/all-video-gallaries",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Blog",
    icon: Settings,
    children: [
      {
        label: "Blog Category",
        href: "/dashboard/blog/blog-category/all-blog-category",
        icon: User,
      },

      {
        label: "Blog Posts",
        href: "/dashboard/blog/blog-posts/all-blog-posts",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Testimonials",
    href: "/dashboard/testimonials/all-testimonials",
    icon: BarChart3,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // Stores explicit user toggle actions (true = opened, false = closed)
  const [userToggles, setUserToggles] = useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setUserToggles((prev) => {
      const item = menuItems.find((m) => m.label === label);
      const isChildActive = item?.children?.some(
        (child) => child.href === pathname,
      );
      const currentlyOpen = prev[label] ?? isChildActive ?? false;

      // Accordion effect: Close all other dropdowns when opening a new one
      return {
        [label]: !currentlyOpen,
      };
    });
  };

  const isActive = (href?: string) => href === pathname;

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
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
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-md focus:outline-none hover:bg-gray-100 transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isChildActive =
            hasChildren && item.children?.some((child) => isActive(child.href));

          // Derive open state: user toggle takes precedence; otherwise auto-open if child active
          const isDropdownOpen =
            userToggles[item.label] ?? isChildActive ?? false;
          const ParentIcon = item.icon;

          if (hasChildren) {
            return (
              <div key={item.label} className="space-y-1">
                {/* Parent Button */}
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full cursor-pointer flex items-center justify-between px-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isChildActive
                      ? "bg-gray-100 text-emerald-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {ParentIcon && (
                      <ParentIcon className="w-5 h-5 text-gray-500" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Submenu Container with CSS Grid Height Transition */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isDropdownOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-6 pt-1 space-y-1">
                      {item.children?.map((child) => {
                        const childActive = isActive(child.href);
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href || "#"}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-1.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                              childActive
                                ? "bg-emerald-50 text-emerald-700 font-semibold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {ChildIcon && (
                              <ChildIcon
                                className={`w-4 h-4 transition-colors ${
                                  childActive
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Single Link Items
          const singleActive = isActive(item.href);
          return (
            <Link
              key={item.href || item.label}
              href={item.href || "#"}
              onClick={() => {
                setUserToggles({}); // Close all dropdowns when clicking a single menu item
                onClose();
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                singleActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {ParentIcon && (
                <ParentIcon
                  className={`w-5 h-5 transition-colors ${
                    singleActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
