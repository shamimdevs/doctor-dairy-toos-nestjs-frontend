// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
//   ShieldCheck,
//   Clock,
//   Sparkles,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// interface Slide {
//   id: number;
//   titleEn: string;
//   titleBn: string;
//   subtitleEn: string;
//   subtitleBn: string;
//   discountBadge: string;
//   bgGradient: string;
//   ctaText: string;
//   ctaLink: string;
//   imageUrl: string;
//   accentIcon: React.ReactNode;
// }

// export default function HeroSection() {
//   const slides: Slide[] = [
//     {
//       id: 1,
//       titleEn: "Grand Monsoon Health Sale!",
//       titleBn: "মনসুন স্পেশাল স্বাস্থ্য অফার!",
//       subtitleEn:
//         "Get flat 15% off on chronic medicines & daily healthcare essentials.",
//       subtitleBn:
//         "নিয়মিত ওষুধ এবং দৈনন্দিন প্রয়োজনীয় স্বাস্থ্যসেবা পণ্যে ফ্ল্যাট ১৫% ছাড়।",
//       discountBadge: "Up to 50% Off",
//       bgGradient: "from-emerald-600 to-teal-800",
//       ctaText: "Shop Medicines",
//       ctaLink: "/category/medicine",
//       imageUrl:
//         "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-300" />
//       ),
//     },
//     {
//       id: 2,
//       titleEn: "Instant Prescription Upload Offer",
//       titleBn: "প্রেসক্রিপশন আপলোড করলেই নিশ্চিত ছাড়!",
//       subtitleEn:
//         "Upload valid prescription and get extra 10% cashback + free delivery.",
//       subtitleBn:
//         "প্রেসক্রিপশন আপলোড করুন এবং অতিরিক্ত ১০% ক্যাশব্যাক ও ফ্রি ডেলিভারি পান।",
//       discountBadge: "Extra 10% Cash",
//       bgGradient: "from-blue-600 to-indigo-800",
//       ctaText: "Upload Now",
//       ctaLink: "/prescription",
//       imageUrl:
//         "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-300" />
//       ),
//     },
//     {
//       id: 3,
//       titleEn: "Vitamins & Supplements Booster",
//       titleBn: "ভিটামিন ও সাপ্লিমেন্ট বুস্টার!",
//       subtitleEn:
//         "Boost your immunity naturally. Buy 2 and get 1 absolutely free.",
//       subtitleBn:
//         "প্রাকৃতিক উপায়ে রোগ প্রতিরোধ ক্ষমতা বাড়ান। ২ টি কিনলে ১ টি ফ্রি!",
//       discountBadge: "Buy 2 Get 1 Free",
//       bgGradient: "from-amber-500 to-orange-700",
//       ctaText: "View Supplements",
//       ctaLink: "/category/supplement",
//       imageUrl:
//         "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-300" />
//       ),
//     },
//     {
//       id: 4,
//       titleEn: "Nurturing Baby & Mom Care",
//       titleBn: "মা ও শিশুর যত্ন নিন নিরাপদে",
//       subtitleEn:
//         "Dermatologically tested premium baby formulas and skin protection creams.",
//       subtitleBn:
//         "বিশেষজ্ঞদের দ্বারা পরীক্ষিত প্রিমিয়াম বেবি ফর্মুলা এবং স্কিন প্রটেকশন ক্রিম।",
//       discountBadge: "Flat 20% Off",
//       bgGradient: "from-pink-600 to-purple-800",
//       ctaText: "Shop Baby Care",
//       ctaLink: "/category/baby-mom-care",
//       imageUrl:
//         "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-pink-300" />
//       ),
//     },
//   ];

//   const [current, setCurrent] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const touchStartX = useRef<number | null>(null);
//   const touchEndX = useRef<number | null>(null);
//   const [touchStartY, setTouchStartY] = useState<number | null>(null);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setIsPaused(true);
//     touchStartX.current = e.targetTouches[0].clientX;
//     touchEndX.current = e.targetTouches[0].clientX;
//     setTouchStartY(e.targetTouches[0].clientY);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     if (touchStartX.current === null || touchEndX.current === null) return;

//     const diffX = touchStartX.current - touchEndX.current;
//     const diffY = (touchStartY || 0) - (touchEndX.current || 0);
//     const swipeThreshold = 40;

//     if (
//       Math.abs(diffX) > Math.abs(diffY || 0) &&
//       Math.abs(diffX) > swipeThreshold
//     ) {
//       if (diffX > swipeThreshold) {
//         nextSlide();
//       } else if (diffX < -swipeThreshold) {
//         prevSlide();
//       }
//     }

//     touchStartX.current = null;
//     touchEndX.current = null;
//     setTouchStartY(null);
//     setIsPaused(false);
//   };

//   useEffect(() => {
//     if (!isPaused) {
//       timerRef.current = setInterval(() => {
//         nextSlide();
//       }, 3000);
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isPaused, nextSlide]);

//   return (
//     <section
//       className="container py-4 md:py-8 overflow-hidden"
//       aria-roledescription="carousel"
//       aria-label="Promotional Offers Carousel"
//     >
//       <div
//         className="
//       relative
//       overflow-hidden
//       rounded-lg
//       sm:rounded-2xl
//       md:rounded-3xl
//       shadow-xl
//       bg-slate-900
//       w-full
//       h-62.5
//       sm:h-80
//       md:h-112.5
//     "
//         onMouseEnter={() => setIsPaused(true)}
//         onMouseLeave={() => setIsPaused(false)}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* Slides Track */}
//         <div
//           className="relative flex w-full h-full transition-transform duration-700 ease-out"
//           style={{ transform: `translateX(-${current * 100}%)` }}
//         >
//           {slides.map((slide, index) => (
//             <div
//               key={slide.id}
//               className={`min-w-full h-full relative overflow-hidden bg-linear-to-r ${slide.bgGradient}`}
//               aria-hidden={current !== index}
//               role="group"
//               aria-roledescription="slide"
//               aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.titleEn}`}
//             >
//               <div className="absolute inset-0 bg-black/25 z-0" />

//               <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent z-1 md:hidden" />
//               <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent z-1 hidden md:block" />

//               {/* Content */}
//               <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-4 sm:px-6 md:px-10 lg:px-12 py-4">
//                 {/* Text */}
//                 <div className="flex flex-col justify-center items-start text-white space-y-2 md:space-y-4 max-w-lg">
//                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/20">
//                     {slide.accentIcon}
//                     {slide.discountBadge}
//                   </span>

//                   <div>
//                     <h2 className="text-sm sm:text-lg md:text-3xl lg:text-4xl font-extrabold leading-tight">
//                       {slide.titleEn}
//                     </h2>

//                     <p className="text-xs sm:text-sm md:text-lg font-semibold opacity-95 mt-1">
//                       {slide.titleBn}
//                     </p>
//                   </div>

//                   <div className="hidden sm:block opacity-90">
//                     <p className="text-xs md:text-base">{slide.subtitleEn}</p>

//                     <p className="text-xs md:text-sm mt-1">
//                       {slide.subtitleBn}
//                     </p>
//                   </div>

//                   <Link
//                     href={slide.ctaLink}
//                     className="
//                   inline-flex
//                   items-center
//                   gap-2
//                   bg-white
//                   hover:bg-slate-100
//                   text-slate-900
//                   font-bold
//                   px-4
//                   md:px-6
//                   py-2
//                   md:py-3
//                   rounded-xl
//                   transition-all
//                 "
//                   >
//                     {slide.ctaText}
//                     <ArrowRight className="w-4 h-4 text-emerald-600" />
//                   </Link>
//                 </div>

//                 {/* Desktop Image */}
//                 <div className="hidden md:flex items-center justify-center h-full">
//                   <div className="w-[80%] h-80 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
//                     <Image
//                       src={slide.imageUrl}
//                       alt={slide.titleEn}
//                       width={800}
//                       height={450}
//                       className="w-full h-full object-cover"
//                       priority={index === 0}
//                     />
//                   </div>
//                 </div>

//                 {/* Mobile Decoration */}
//                 <div className="absolute right-0 bottom-0 w-1/4 h-1/3 md:hidden opacity-10 pointer-events-none">
//                   <Image
//                     height={200}
//                     width={200}
//                     src={slide.imageUrl}
//                     alt=""
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Previous */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center p-2 rounded-full bg-black/40 text-white"
//           aria-label="Previous Slide"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>

//         {/* Next */}
//         <button
//           onClick={nextSlide}
//           className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center p-2 rounded-full bg-black/40 text-white"
//           aria-label="Next Slide"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>

//         {/* Indicators */}
//         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className={`h-2 rounded-full transition-all ${
//                 current === index ? "w-6 bg-white" : "w-2 bg-white/40"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
//   ShieldCheck,
//   Clock,
//   Sparkles,
//   TrendingUp,
//   Activity,
//   Award,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// interface Slide {
//   id: number;
//   titleEn: string;
//   titleBn: string;
//   subtitleEn: string;
//   subtitleBn: string;
//   discountBadge: string;
//   bgGradient: string;
//   ctaText: string;
//   ctaLink: string;
//   imageUrl: string;
//   accentIcon: React.ReactNode;
// }

// export default function HeroSection() {
//   const slides: Slide[] = [
//     {
//       id: 1,
//       titleEn: "Smart Cattle Health Tracking",
//       titleBn: "পশুর স্বাস্থ্য ট্র্যাকিং এখন আরও সহজ!",
//       subtitleEn:
//         "Monitor vaccination schedules, disease history, and dynamic treatment cycles effortlessly.",
//       subtitleBn:
//         "টিকা দেওয়ার সময়সূচী, রোগের ইতিহাস এবং চিকিৎসা চক্র সহজে পর্যবেক্ষণ করুন।",
//       discountBadge: "Core Feature",
//       bgGradient: "from-emerald-600 to-teal-800",
//       ctaText: "Manage Health",
//       ctaLink: "/dashboard/health",
//       imageUrl:
//         "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-300" />
//       ),
//     },
//     {
//       id: 2,
//       titleEn: "Maximize Milk Yield Analysis",
//       titleBn: "দুধ উৎপাদন ও স্থায়িত্ব বৃদ্ধি করুন",
//       subtitleEn:
//         "Track daily parameters per livestock head and unlock deeper analytics trends.",
//       subtitleBn:
//         "প্রতিটি গবাদি পশুর দৈনিক দুধ উৎপাদনের নিখুঁত হিসাব ও গ্রাফিকাল অ্যানালিটিক্স দেখুন।",
//       discountBadge: "Smart Analytics",
//       bgGradient: "from-blue-600 to-indigo-800",
//       ctaText: "Check Production",
//       ctaLink: "/dashboard/production",
//       imageUrl:
//         "https://images.unsplash.com/photo-1527153857715-3908f2bcb5ea?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-300" />
//       ),
//     },
//     {
//       id: 3,
//       titleEn: "Automated Inventory & Feed Mix",
//       titleBn: "খাদ্য ও ইনভেন্টরি অটোমেশন",
//       subtitleEn:
//         "Maintain dry fodder status, nutrition value mapping, and alert systems.",
//       subtitleBn:
//         "খামারের খাদ্য মজুদ, পুষ্টির মান এবং রি-অর্ডার অ্যালার্ট সিস্টেম নিয়ন্ত্রণ করুন।",
//       discountBadge: "ERP Tools",
//       bgGradient: "from-amber-500 to-orange-700",
//       ctaText: "View Inventory",
//       ctaLink: "/dashboard/inventory",
//       imageUrl:
//         "https://images.unsplash.com/photo-1594900185994-f25883d6a2a0?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-300" />
//       ),
//     },
//   ];

//   const [current, setCurrent] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const touchStartX = useRef<number | null>(null);
//   const touchEndX = useRef<number | null>(null);
//   const [touchStartY, setTouchStartY] = useState<number | null>(null);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setIsPaused(true);
//     touchStartX.current = e.targetTouches[0].clientX;
//     touchEndX.current = e.targetTouches[0].clientX;
//     setTouchStartY(e.targetTouches[0].clientY);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     if (touchStartX.current === null || touchEndX.current === null) return;

//     const diffX = touchStartX.current - touchEndX.current;
//     const diffY = (touchStartY || 0) - (touchEndX.current || 0);
//     const swipeThreshold = 40;

//     if (
//       Math.abs(diffX) > Math.abs(diffY || 0) &&
//       Math.abs(diffX) > swipeThreshold
//     ) {
//       if (diffX > swipeThreshold) {
//         nextSlide();
//       } else if (diffX < -swipeThreshold) {
//         prevSlide();
//       }
//     }

//     touchStartX.current = null;
//     touchEndX.current = null;
//     setTouchStartY(null);
//     setIsPaused(false);
//   };

//   useEffect(() => {
//     if (!isPaused) {
//       timerRef.current = setInterval(() => {
//         nextSlide();
//       }, 4000);
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isPaused, nextSlide]);

//   return (
//     <section className="container py-4 md:py-8">
//       {/* 6-Column CSS Grid Container */}
//       <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6 items-stretch">
//         {/* Main Carousel: Spans 4 Columns out of 6 */}
//         <div
//           className="
//             relative
//             overflow-hidden
//             rounded-2xl
//             md:rounded-3xl
//             shadow-xl
//             bg-slate-900
//             h-[280px]
//             sm:h-[340px]
//             lg:h-[420px]
//             lg:col-span-4
//           "
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           aria-roledescription="carousel"
//           aria-label="Farm Management Carousel"
//         >
//           {/* Slides Track */}
//           <div
//             className="relative flex w-full h-full transition-transform duration-700 ease-out"
//             style={{ transform: `translateX(-${current * 100}%)` }}
//           >
//             {slides.map((slide, index) => (
//               <div
//                 key={slide.id}
//                 className={`min-w-full h-full relative overflow-hidden bg-gradient-to-r ${slide.bgGradient}`}
//                 aria-hidden={current !== index}
//                 role="group"
//                 aria-roledescription="slide"
//                 aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.titleEn}`}
//               >
//                 <div className="absolute inset-0 bg-black/30 z-0" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-1" />

//                 {/* Content */}
//                 <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-6 sm:px-8 md:px-10 py-4">
//                   {/* Left Side: Text Details */}
//                   <div className="flex flex-col justify-center items-start text-white space-y-2 md:space-y-4 max-w-lg">
//                     <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/20">
//                       {slide.accentIcon}
//                       {slide.discountBadge}
//                     </span>

//                     <div>
//                       <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight">
//                         {slide.titleEn}
//                       </h2>
//                       <p className="text-xs sm:text-sm md:text-base font-semibold opacity-95 mt-0.5">
//                         {slide.titleBn}
//                       </p>
//                     </div>

//                     <div className="hidden sm:block opacity-90 text-slate-100">
//                       <p className="text-xs md:text-sm">{slide.subtitleEn}</p>
//                       <p className="text-xs md:text-xs mt-0.5 opacity-80">
//                         {slide.subtitleBn}
//                       </p>
//                     </div>

//                     <Link
//                       href={slide.ctaLink}
//                       className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2 text-xs md:text-sm rounded-xl transition-all shadow-md group"
//                     >
//                       {slide.ctaText}
//                       <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
//                     </Link>
//                   </div>

//                   {/* Right Side: Rendered Inline Image */}
//                   <div className="hidden md:flex items-center justify-center h-full">
//                     <div className="w-[90%] h-64 lg:h-72 rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
//                       <Image
//                         src={slide.imageUrl}
//                         alt={slide.titleEn}
//                         fill
//                         sizes="(max-width: 1024px) 50vw, 33vw"
//                         className="object-cover"
//                         priority={index === 0}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Navigation Controls */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
//             aria-label="Previous Slide"
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </button>

//           <button
//             onClick={nextSlide}
//             className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
//             aria-label="Next Slide"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>

//           {/* Carousel Indicators */}
//           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrent(index)}
//                 className={`h-1.5 rounded-full transition-all ${
//                   current === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side Cards: Spans 2 Columns out of 6 */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-2 gap-4 items-stretch">
//           {/* Top Card: Live Health Reports */}
//           <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-slate-900 to-emerald-950 text-white flex flex-col justify-between p-5 min-h-[130px] lg:h-auto">
//             <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-500">
//               <Image
//                 src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop"
//                 alt="Breeding and Pedigree analytics tracking"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-1" />

//             <div className="relative z-10">
//               <div className="flex justify-between items-start mb-2">
//                 <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
//                   <Activity className="w-3 h-3" /> Live Monitor
//                 </span>
//               </div>
//               <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
//                 Breeding & Genealogy
//               </h3>
//               <p className="text-xs text-slate-300 mt-1 line-clamp-2">
//                 Track complete dynamic family lineage trees and artificial
//                 insemination windows.
//               </p>
//             </div>

//             <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
//               <Link
//                 href="/dashboard/breeding"
//                 className="text-xs text-emerald-400 font-bold flex items-center gap-1 group-hover:text-emerald-300"
//               >
//                 Open Genealogy{" "}
//                 <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
//               </Link>
//             </div>
//           </div>

//           {/* Bottom Card: Financial Insights */}
//           <div className="relative group overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-slate-900 to-amber-950 text-white flex flex-col justify-between p-5 min-h-[130px] lg:h-auto">
//             <div className="absolute inset-0 z-0 opacity-30 group-hover:scale-105 transition-transform duration-500">
//               <Image
//                 src="https://images.unsplash.com/photo-1543257580-7269da773bf5?q=80&w=400&auto=format&fit=crop"
//                 alt="Farm expense reports and metrics dashboard"
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-1" />

//             <div className="relative z-10">
//               <div className="flex justify-between items-start mb-2">
//                 <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
//                   <TrendingUp className="w-3 h-3" /> Real-time
//                 </span>
//               </div>
//               <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
//                 Expense & Profit Logs
//               </h3>
//               <p className="text-xs text-slate-300 mt-1 line-clamp-2">
//                 Correlate feed expenditures directly with daily production
//                 profiles to map margins.
//               </p>
//             </div>

//             <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
//               <Link
//                 href="/dashboard/finance"
//                 className="text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:text-amber-300"
//               >
//                 View Financials{" "}
//                 <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
//   ShieldCheck,
//   Clock,
//   Sparkles,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// interface Slide {
//   id: number;
//   titleEn: string;
//   titleBn: string;
//   subtitleEn: string;
//   subtitleBn: string;
//   discountBadge: string;
//   bgGradient: string;
//   ctaText: string;
//   ctaLink: string;
//   imageUrl: string;
//   accentIcon: React.ReactNode;
// }

// export default function HeroSection() {
//   const slides: Slide[] = [
//     {
//       id: 1,
//       titleEn: "Smart Cattle Health Tracking",
//       titleBn: "পশুর স্বাস্থ্য ট্র্যাকিং এখন আরও সহজ!",
//       subtitleEn:
//         "Monitor vaccination schedules, disease history, and dynamic treatment cycles effortlessly.",
//       subtitleBn:
//         "টিকা দেওয়ার সময়সূচী, রোগের ইতিহাস এবং চিকিৎসা চক্র সহজে পর্যবেক্ষণ করুন।",
//       discountBadge: "Core Feature",
//       bgGradient: "from-emerald-600 to-teal-800",
//       ctaText: "Manage Health",
//       ctaLink: "/dashboard/health",
//       imageUrl:
//         "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-300" />
//       ),
//     },
//     {
//       id: 2,
//       titleEn: "Maximize Milk Yield Analysis",
//       titleBn: "দুধ উৎপাদন ও স্থায়িত্ব বৃদ্ধি করুন",
//       subtitleEn:
//         "Track daily parameters per livestock head and unlock deeper analytics trends.",
//       subtitleBn:
//         "প্রতিটি গবাদি পশুর দৈনিক দুধ উৎপাদনের নিখুঁত হিসাব ও গ্রাফিকাল অ্যানালিটিক্স দেখুন।",
//       discountBadge: "Smart Analytics",
//       bgGradient: "from-blue-600 to-indigo-800",
//       ctaText: "Check Production",
//       ctaLink: "/dashboard/production",
//       imageUrl:
//         "https://images.unsplash.com/photo-1527153857715-3908f2bcb5ea?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-300" />
//       ),
//     },
//     {
//       id: 3,
//       titleEn: "Automated Inventory & Feed Mix",
//       titleBn: "খাদ্য ও ইনভেন্টরি অটোমেশন",
//       subtitleEn:
//         "Maintain dry fodder status, nutrition value mapping, and alert systems.",
//       subtitleBn:
//         "খামারের খাদ্য মজুদ, পুষ্টির মান এবং রি-অর্ডার অ্যালার্ট সিস্টেম নিয়ন্ত্রণ করুন।",
//       discountBadge: "ERP Tools",
//       bgGradient: "from-amber-500 to-orange-700",
//       ctaText: "View Inventory",
//       ctaLink: "/dashboard/inventory",
//       imageUrl:
//         "https://images.unsplash.com/photo-1594900185994-f25883d6a2a0?q=80&w=800&auto=format&fit=crop",
//       accentIcon: (
//         <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-300" />
//       ),
//     },
//   ];

//   const [current, setCurrent] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const touchStartX = useRef<number | null>(null);
//   const touchEndX = useRef<number | null>(null);
//   const [touchStartY, setTouchStartY] = useState<number | null>(null);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const handleTouchStart = (e: React.TouchEvent) => {
//     setIsPaused(true);
//     touchStartX.current = e.targetTouches[0].clientX;
//     touchEndX.current = e.targetTouches[0].clientX;
//     setTouchStartY(e.targetTouches[0].clientY);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     touchEndX.current = e.targetTouches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     if (touchStartX.current === null || touchEndX.current === null) return;

//     const diffX = touchStartX.current - touchEndX.current;
//     const diffY = (touchStartY || 0) - (touchEndX.current || 0);
//     const swipeThreshold = 40;

//     if (
//       Math.abs(diffX) > Math.abs(diffY || 0) &&
//       Math.abs(diffX) > swipeThreshold
//     ) {
//       if (diffX > swipeThreshold) {
//         nextSlide();
//       } else if (diffX < -swipeThreshold) {
//         prevSlide();
//       }
//     }

//     touchStartX.current = null;
//     touchEndX.current = null;
//     setTouchStartY(null);
//     setIsPaused(false);
//   };

//   useEffect(() => {
//     if (!isPaused) {
//       timerRef.current = setInterval(() => {
//         nextSlide();
//       }, 4000);
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isPaused, nextSlide]);

//   return (
//     <section className="container py-4 md:py-8">
//       {/* 6-Column CSS Grid Container */}
//       <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6 items-stretch">
//         {/* Main Carousel: Spans 4 Columns out of 6 */}
//         <div
//           className="
//             relative
//             overflow-hidden
//             rounded-2xl
//             md:rounded-3xl
//             shadow-xl
//             bg-slate-900
//             h-[280px]
//             sm:h-[340px]
//             lg:h-[420px]
//             lg:col-span-4
//           "
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           aria-roledescription="carousel"
//           aria-label="Farm Management Carousel"
//         >
//           {/* Slides Track */}
//           <div
//             className="relative flex w-full h-full transition-transform duration-700 ease-out"
//             style={{ transform: `translateX(-${current * 100}%)` }}
//           >
//             {slides.map((slide, index) => (
//               <div
//                 key={slide.id}
//                 className={`min-w-full h-full relative overflow-hidden bg-gradient-to-r ${slide.bgGradient}`}
//                 aria-hidden={current !== index}
//                 role="group"
//                 aria-roledescription="slide"
//                 aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.titleEn}`}
//               >
//                 <div className="absolute inset-0 bg-black/30 z-0" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-1" />

//                 {/* Content */}
//                 <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-6 sm:px-8 md:px-10 py-4">
//                   {/* Left Side: Text Details */}
//                   <div className="flex flex-col justify-center items-start text-white space-y-2 md:space-y-4 max-w-lg">
//                     <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/20">
//                       {slide.accentIcon}
//                       {slide.discountBadge}
//                     </span>

//                     <div>
//                       <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight">
//                         {slide.titleEn}
//                       </h2>
//                       <p className="text-xs sm:text-sm md:text-base font-semibold opacity-95 mt-0.5">
//                         {slide.titleBn}
//                       </p>
//                     </div>

//                     <div className="hidden sm:block opacity-90 text-slate-100">
//                       <p className="text-xs md:text-sm">{slide.subtitleEn}</p>
//                       <p className="text-xs md:text-xs mt-0.5 opacity-80">
//                         {slide.subtitleBn}
//                       </p>
//                     </div>

//                     <Link
//                       href={slide.ctaLink}
//                       className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2 text-xs md:text-sm rounded-xl transition-all shadow-md group"
//                     >
//                       {slide.ctaText}
//                       <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
//                     </Link>
//                   </div>

//                   {/* Right Side: Rendered Inline Image */}
//                   <div className="hidden md:flex items-center justify-center h-full">
//                     <div className="w-[90%] h-64 lg:h-72 rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl relative">
//                       <Image
//                         src={slide.imageUrl}
//                         alt={slide.titleEn}
//                         fill
//                         sizes="(max-width: 1024px) 50vw, 33vw"
//                         className="object-cover"
//                         priority={index === 0}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Navigation Controls */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
//             aria-label="Previous Slide"
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </button>

//           <button
//             onClick={nextSlide}
//             className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
//             aria-label="Next Slide"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>

//           {/* Carousel Indicators */}
//           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrent(index)}
//                 className={`h-1.5 rounded-full transition-all ${
//                   current === index ? "w-5 bg-white" : "w-1.5 bg-white/40"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side Cards: Spans 2 Columns out of 6 (Pure Static Images) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-2 gap-4 items-stretch">
//           {/* Top Image Card */}
//           <div className="relative overflow-hidden rounded-2xl shadow-lg min-h-[130px] lg:h-auto bg-slate-100">
//             <Image
//               src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop"
//               alt="Dairy farm management context visualization"
//               fill
//               sizes="(max-width: 1024px) 50vw, 33vw"
//               className="object-cover"
//             />
//           </div>

//           {/* Bottom Image Card */}
//           <div className="relative overflow-hidden rounded-2xl shadow-lg min-h-[130px] lg:h-auto bg-slate-100">
//             <Image
//               src="https://images.unsplash.com/photo-1543257580-7269da773bf5?q=80&w=400&auto=format&fit=crop"
//               alt="Livestock performance context visualization"
//               fill
//               sizes="(max-width: 1024px) 50vw, 33vw"
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
  id: number;
  imageUrl: string;
  altText: string;
}

export default function HeroSection() {
  const slides: Slide[] = [
    {
      id: 1,
      imageUrl: "/images/di2.jpg",
      altText: "Smart Cattle Health Tracking Context",
    },
    {
      id: 2,
      imageUrl: "/images/di3.jpg",
      altText: "Milk Yield Analysis Analytics Visual",
    },
    {
      id: 3,
      imageUrl: "/images/di2.jpg",
      altText: "Automated Feed Mix Inventory Layout",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = (touchStartY || 0) - (touchEndX.current || 0);
    const swipeThreshold = 40;

    if (
      Math.abs(diffX) > Math.abs(diffY || 0) &&
      Math.abs(diffX) > swipeThreshold
    ) {
      if (diffX > swipeThreshold) {
        nextSlide();
      } else if (diffX < -swipeThreshold) {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setTouchStartY(null);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, nextSlide]);

  return (
    <section className="container py-4 md:py-8">
      {/* 6-Column CSS Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 md:gap-6 items-stretch">
        {/* Main Carousel: Spans 4 Columns out of 6 (Pure Image Carousel) */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            md:rounded-3xl
            shadow-xl
            bg-slate-900
            h-[280px]
            sm:h-[340px]
            lg:h-[420px]
            lg:col-span-4
          "
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-roledescription="carousel"
          aria-label="Farm Showcase Slider"
        >
          {/* Slides Track */}
          <div
            className="relative flex w-full h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="min-w-full h-full relative overflow-hidden bg-slate-800"
                aria-hidden={current !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.altText}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className=""
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all ${
                  current === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Cards: Spans 2 Columns out of 6 (Pure Static Images) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-2 gap-4 items-stretch">
          {/* Top Image Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg min-h-[130px] lg:h-auto bg-slate-100">
            <Image
              src="/images/di2.jpg"
              alt="Dairy farm management context visualization"
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className=""
            />
          </div>

          {/* Bottom Image Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg min-h-[130px] lg:h-auto bg-slate-100">
            <Image
              src="/images/dairay-2.jpg"
              alt="Livestock performance context visualization"
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
