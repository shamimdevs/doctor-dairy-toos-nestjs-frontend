/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { sidebarToggle } from "@/src/redux/features/sidebarSlice";
import CartSidebar from "./CartSidebar";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";
import { slugify } from "@/src/utils/slugify";

export default function Navbar() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.cartItems || []);

  const { data: catData } = useGetAllProductCategoriesQuery(undefined);
  const filteredData = catData?.data || [];

  // Calculate unique product count
  const uniqueProductCount = cartItems.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="w-full bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container h-16 flex items-center justify-between gap-4 ">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900 rounded p-1 shrink-0 select-none"
          >
            <span className="text-emerald-700 flex items-center">
              Doctor
              <span className="text-amber-500 flex items-center mx-1">
                Dairy
                <Wrench
                  size={18}
                  className="stroke-3 text-emerald-600 ml-1 transform rotate-45 animate-bounce"
                  style={{ animationDuration: "3s" }}
                />
              </span>
              Tools
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <input
              type="text"
              placeholder="Search cattle, milk records, or farm inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <button className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-600">
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Navbar Cart Icon */}
            <button
              onClick={() => dispatch(sidebarToggle())}
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-all"
            >
              <ShoppingBag size={20} className="sm:w-5.5 sm:h-5.5" />
              {uniqueProductCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {uniqueProductCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* ==================== CATEGORY SCROLLER ==================== */}
        <div className="w-full bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 relative flex items-center group">
            <button
              onClick={() => scroll("left")}
              className="absolute cursor-pointer left-2 z-10 p-1 bg-white hover:bg-slate-100 hover:text-emerald-600 text-slate-500 rounded-full shadow-md border border-slate-200 transition-all active:scale-95 hidden md:block"
            >
              <ChevronLeft size={18} />
            </button>

            <div
              ref={scrollRef}
              className="w-full flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 h-11 px-8"
            >
              {filteredData?.map((cat: any) => {
                const slug = slugify(cat?.name);
                const targetPath =
                  slug === "home" ? "/" : `/category/${cat?.slug}`;
                const isActive = pathname === targetPath;

                return (
                  <Link
                    key={cat.id}
                    href={targetPath}
                    ref={isActive ? activeRef : null}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all
                        ${
                          isActive
                            ? "text-emerald-600 "
                            : "text-slate-600 hover:text-emerald-600"
                        }`}
                  >
                    {cat?.name}
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute cursor-pointer right-2 z-10 p-1 bg-white hover:bg-slate-100 hover:text-emerald-600 text-slate-500 rounded-full shadow-md border border-slate-200 transition-all active:scale-95 hidden md:block"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== FLOATING SIDE CART BUTTON ==================== */}
      <button
        onClick={() => dispatch(sidebarToggle())}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-emerald-600 text-white flex-col items-center justify-center gap-1 p-3 rounded-l-2xl shadow-2xl hover:bg-emerald-700 transition-all group border border-emerald-500 border-r-0"
      >
        <div className="relative">
          <ShoppingBag
            size={22}
            className="group-hover:scale-110 transition-transform"
          />
          {uniqueProductCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
              {uniqueProductCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider writing-mode-vertical mt-1">
          Cart
        </span>
      </button>

      {/* ==================== MOBILE MENU SIDE DRAWER ==================== */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-4/5 max-w-xs bg-white border-r border-slate-200 flex flex-col p-6 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-black text-slate-900">
              Medico Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search medicine..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute right-3 top-3.5 text-slate-400"
            />
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto pr-1 no-scrollbar flex-1">
            <div className="h-px bg-slate-200 my-2" />
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-4 mb-1">
              Product Categories
            </p>
            {filteredData?.map((cat: any) => {
              const slug = slugify(cat?.name);
              const targetPath = slug === "home" ? "/" : `/category/${slug}`;
              return (
                <Link
                  key={cat.id}
                  href={targetPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  {cat?.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ==================== CART SIDEBAR ==================== */}
      <CartSidebar />
    </>
  );
}
