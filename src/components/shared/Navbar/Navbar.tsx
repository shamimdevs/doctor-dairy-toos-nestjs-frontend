/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Home,
  Info,
  MapPin,
  Download,
} from "lucide-react";
import Link from "next/link";
import { sidebarToggle } from "@/src/redux/features/sidebarSlice";
import CartSidebar from "./CartSidebar";
import ProductSearch from "./ProductSearch";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopBarVisible(window.scrollY <= 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const downloadAllCatalogImages = () => {
    const files = [
      "file1.jpeg",
      "file2.jpeg",
      "file3.jpeg",
      "file4.jpeg",
      "file5.jpeg",
      "fil6.jpeg",
      "file7.jpeg",
      "file8.jpeg",
    ];

    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `/images/file/${file}`;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 800);
    });
  };

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="w-full bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* ==================== TOP INFO BAR ==================== */}
        <div
          className={`w-full bg-slate-900 text-slate-200 overflow-hidden transition-all duration-300 ease-in-out ${
            isTopBarVisible
              ? "max-h-16 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container flex items-center justify-between gap-2 py-1.5 text-xs">
            {/* Contact Info (Left) */}
            <ul className="flex items-center gap-3 sm:gap-5">
              <li className="flex items-center gap-1.5">
                <Phone
                  size={13}
                  className="text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+8801797980777"
                  className="hover:text-emerald-400 text-base transition-colors focus:outline-none focus:underline whitespace-nowrap"
                >
                  +880 1797-980777
                </a>
              </li>
              <li className="hidden sm:flex items-center gap-1.5">
                <Mail
                  size={13}
                  className="text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:doctordairytoolsbd@gmail.com"
                  className="hover:text-emerald-400 text-sm transition-colors focus:outline-none focus:underline whitespace-nowrap"
                >
                  doctordairytoolsbd@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Links (Right) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="https://www.facebook.com/doctordairytools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white inline-flex items-center justify-center hover:scale-110 transition-transform duration-200 p-1.5 bg-[#1877F2] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on Facebook"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/dr-sajeeb-rana-064045423/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white inline-flex items-center justify-center hover:scale-110 transition-transform duration-200 p-1.5 bg-[#0A66C2] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on LinkedIn"
              >
                <svg
                  className="w-5 h-5 mt-0.5 fill-current"
                  viewBox="0 0 22 30"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@vetcare2019"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white inline-flex items-center justify-center hover:scale-110 transition-transform duration-200 p-1.5 bg-[#FF0000] rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on YouTube"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="container h-16 flex items-center justify-between gap-4 ">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-tight rounded p-1 shrink-0 select-none"
          >
            <span className="flex items-center text-xl sm:text-2xl font-black tracking-tight text-emerald-700">
              Doctor
              <span className="text-amber-500 mx-1">Dairy</span>
              Tools
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Livestock Solutions
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <ProductSearch placeholder="Search cattle, milk records, or farm inventory..." />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 md:hidden rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-all"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

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
        className="hidden cursor-pointer md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-emerald-600 text-white flex-col items-center justify-center gap-1 p-3 rounded-l-2xl shadow-2xl hover:bg-emerald-700 transition-all group border border-emerald-500 border-r-0"
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

      {/* ==================== FLOATING WHATSAPP BUTTON ==================== */}
      <a
        href="https://wa.me/8801797980777"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed cursor-pointer bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14  rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:bg-[#20bd5a] transition-all "
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.986.579 3.837 1.579 5.395L2 22l4.72-1.55A9.947 9.947 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.062a8.02 8.02 0 0 1-4.09-1.122l-.293-.174-2.802.92.933-2.732-.19-.28A8.02 8.02 0 1 1 20.02 12a8.03 8.03 0 0 1-8.019 8.062z" />
        </svg>
      </a>

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
            <Link
              href="/"
              className="flex items-center gap-1.5 text-base sm:text-2xl font-black tracking-tight text-slate-900 rounded p-1 shrink-0 select-none"
            >
              <span className="text-emerald-700 flex items-center">
                Doctor
                <span className="text-amber-500 flex items-center mx-1">
                  Dairy
                </span>
                Tools
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 overflow-y-auto pr-1 no-scrollbar flex-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <Home size={16} className="text-emerald-600 shrink-0" />
              Home
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <Info size={16} className="text-emerald-600 shrink-0" />
              About Us
            </Link>

            <button
              type="button"
              onClick={() => {
                downloadAllCatalogImages();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <Download size={16} className="text-emerald-600 shrink-0" />
              Download File
            </button>

            {/* Product Categories Dropdown */}
            <button
              onClick={() => setIsMobileCategoriesOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              aria-expanded={isMobileCategoriesOpen}
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-emerald-600 shrink-0" />
                Product Categories
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  isMobileCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileCategoriesOpen ? "max-h-55" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-1 pl-4 border-l-2 border-emerald-100 ml-6 my-1 max-h-60 overflow-y-auto">
                {filteredData?.map((cat: any) => {
                  const slug = slugify(cat?.name);
                  const targetPath =
                    slug === "home" ? "/" : `/category/${cat?.slug}`;
                  return (
                    <Link
                      key={cat.id}
                      href={targetPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0"
                    >
                      {cat?.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-slate-200 my-2" />
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-4 mb-1">
              Contact
            </p>

            <a
              href="tel:+8801797980777"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <Phone size={16} className="text-emerald-600 shrink-0" />
              +880 1797-980777
            </a>
            {/* 
            <a
              href="https://wa.me/8801797980777"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            >
              <MessageCircle size={16} className="text-emerald-600 shrink-0" />
              Chat on WhatsApp
            </a> */}

            <div className="flex items-start gap-2.5 px-4 py-2.5 text-xs text-slate-500 leading-relaxed">
              <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                প্রজাবাহীনী প্রেস লেন (অন্নপূর্ণা হোটেলের গলি), সাতমাথা, বগুড়া
                সদর, Puran Bogra, Bangladesh, 5800
              </span>
            </div>
          </nav>

          {/* Social Icons */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-4 mb-2">
              Follow Us
            </p>
            <div className="flex items-center gap-2.5 px-4">
              <a
                href="https://www.facebook.com/doctordairytools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:scale-110 transition-transform duration-200 p-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on Facebook"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/dr-sajeeb-rana-064045423/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:scale-110 transition-transform duration-200 p-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on LinkedIn"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 22 30"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@vetcare2019"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF0000] hover:scale-110 transition-transform duration-200 p-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Visit Doctor Dairy Tools on YouTube"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE SEARCH OVERLAY ==================== */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
          isMobileSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileSearchOpen(false)}
        />
        <div
          className={`absolute inset-x-0 top-0 bg-white border-b border-slate-200 p-4 shadow-lg transition-transform duration-200 ease-out ${
            isMobileSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProductSearch
                autoFocus={isMobileSearchOpen}
                onResultClick={() => setIsMobileSearchOpen(false)}
                placeholder="Search products..."
              />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all shrink-0"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================== CART SIDEBAR ==================== */}
      <CartSidebar />
    </>
  );
}
