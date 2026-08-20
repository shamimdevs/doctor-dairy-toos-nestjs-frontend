"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
} from "lucide-react";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";

export default function MedicoFooter() {
  const currentYear = new Date().getFullYear();
  const { data: catData } = useGetAllProductCategoriesQuery(undefined);
  const categories = (catData?.data || []).slice(0, 6);

  return (
    <footer
      className="w-full bg-foreground text-slate-300 border-t border-slate-700/50 font-sans"
      aria-label="Doctor Dairy Tools Footer"
    >
      {/* ১. ট্রাস্ট ও ভ্যালু প্রোপোজিশন সেকশন (Value Propositions) */}
      <div className="border-b border-slate-700/50 bg-secoundary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Super Fast Delivery */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Truck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Super Fast Delivery
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Veterinary & farm supplies delivered safely
              </p>
            </div>
          </div>

          {/* 100% Genuine Products */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                100% Genuine Products
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Sourced from trusted manufacturers
              </p>
            </div>
          </div>

          {/* Easy Returns & Refunds */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <RotateCcw size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Easy Returns & Refunds
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Hassle-free return policy
              </p>
            </div>
          </div>

          {/* 24/7 Support Desk */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-200">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Clock size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">24/7 Support Desk</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Chat with veterinary experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ২. মেইন ফুটার লিংক সেকশন (Primary Links) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* ব্র্যান্ড পরিচিতি ও হেল্পলাইন */}
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-tight text-slate-900 rounded p-1 shrink-0 select-none w-fit"
            aria-label="Doctor Dairy Tools Home"
          >
            <span className="text-emerald-700 flex items-center">
              Doctor
              <span className="text-amber-500 flex items-center mx-1">
                Dairy
              </span>
              Tools
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            ডক্টর ডেইরি টুলস ভেটেরিনারিয়ান দ্বারা পরিচালিত বাংলাদেশের বিশ্বস্থ
            ভেটেরিনারি সার্জিক্যাল ও ডেইরি ফার্ম সরঞ্জামাদি সরবরাহকারি
            প্রতিষ্ঠান।
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/doctordairytools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:scale-110 transition-transform duration-200 p-1.5 bg-slate-800 rounded-full border border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Visit Doctor Dairy Tools on Facebook"
            >
              <svg
                className="w-7 h-7 fill-current"
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
              className="text-[#0A66C2] hover:scale-110 transition-transform duration-200 p-1.5 bg-slate-800 rounded-full border border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Visit Doctor Dairy Tools on LinkedIn"
            >
              <svg
                className="w-7 h-7 fill-current"
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
              className="text-[#FF0000] hover:scale-110 transition-transform duration-200 p-1.5 bg-slate-800 rounded-full border border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Visit Doctor Dairy Tools on YouTube"
            >
              <svg
                className="w-7 h-7 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
              </svg>
            </a>
          </div>
        </div>

        {/* শপ ক্যাটাগরি কলাম */}
        <nav aria-label="Footer Shop Categories">
          <p className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Shop Categories
          </p>
          <ul className="space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* কাস্টমার সার্ভিস কলাম */}
        <nav aria-label="Customer Services Links">
          <p className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Quick Links
          </p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link
                href="/blog"
                className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                Our Blog
              </Link>
            </li>
            <li>
              <Link
                href="/refund-policy"
                className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                Refunds & Returns
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/terms-and-conditions"
                className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </nav>

        {/* কন্টাক্ট ও সাপোর্ট কলাম */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            Support &amp; Contact
          </p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin
                size={16}
                className="text-emerald-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                প্রজাবাহীনী প্রেস লেন (অন্নপূর্ণা হোটেলের গলি), সাতমাথা, বগুড়া
                সদর, Puran Bogra, Bangladesh, 5800
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail
                size={16}
                className="text-emerald-400 shrink-0"
                aria-hidden="true"
              />
              <a
                href="mailto:doctordairytoolsbd@gmail.com"
                className="hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                doctordairytoolsbd@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone
                size={16}
                className="text-emerald-400 shrink-0"
                aria-hidden="true"
              />
              <a
                href="tel:+8801797980777"
                className="hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                +880 1797-980777
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ৩. লিগ্যাল কপিরাইট ও পেমেন্ট পার্টনার সেকশন (Bottom Bar) */}
      <div className="border-t border-slate-700/50 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="space-y-1.5 text-center md:text-left">
            <p>&copy; {currentYear} Doctor Dairy Tools. All rights reserved.</p>
          </div>

          {/* সিকিউর পেমেন্ট মেথড এবং সোশ্যাল লিংক */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm ">
              Designed and Developed by{" "}
              <a
                href="https://zamirul-kabir-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-base text-slate-300 hover:text-emerald-400 transition-colors focus:outline-none focus:underline"
              >
                Zamirul Kabir
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
