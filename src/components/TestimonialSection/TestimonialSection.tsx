"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Award,
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  company: string;
  companyBn: string;
  image: string;
  content: string;
  contentBn: string;
  rating: number;
  date: string;
  verified: boolean;
  category: string;
  categoryBn: string;
  helpfulCount: number;
}

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Md. Kamal Hossain",
      nameBn: "মোঃ কামাল হোসেন",
      role: "Dairy Farm Owner",
      roleBn: "ডেইরি ফার্ম মালিক",
      company: "Green Valley Dairy Farm",
      companyBn: "গ্রিন ভ্যালি ডেইরি ফার্ম",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      content:
        "I've been using their veterinary supplies for over 5 years now. The quality of their surgical instruments and medicines is exceptional. My cattle health has improved significantly, and milk production increased by 30%. Highly recommend!",
      contentBn:
        "আমি ৫ বছরেরও বেশি সময় ধরে তাদের ভেটেরিনারি সরবরাহ ব্যবহার করছি। তাদের অস্ত্রোপচারের যন্ত্রপাতি এবং ওষুধের গুণমান অসাধারণ। আমার গবাদি পশুর স্বাস্থ্য উল্লেখযোগ্যভাবে উন্নত হয়েছে এবং দুধ উৎপাদন ৩০% বৃদ্ধি পেয়েছে। অত্যন্ত সুপারিশ করছি!",
      rating: 5,
      date: "2024-01-10",
      verified: true,
      category: "dairy",
      categoryBn: "ডেইরি",
      helpfulCount: 156,
    },
    {
      id: 2,
      name: "Dr. Sultana Begum",
      nameBn: "ডাঃ সুলতানা বেগম",
      role: "Veterinary Surgeon",
      roleBn: "ভেটেরিনারি সার্জন",
      company: "Animal Care Veterinary Hospital",
      companyBn: "অ্যানিমাল কেয়ার ভেটেরিনারি হাসপাতাল",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      content:
        "The surgical equipment from this platform is world-class. I've performed over 200 surgeries using their instruments, and the precision and durability are unmatched. Their fast delivery service is a lifesaver in emergencies.",
      contentBn:
        "এই প্ল্যাটফর্মের অস্ত্রোপচারের সরঞ্জাম বিশ্বমানের। আমি তাদের যন্ত্রপাতি ব্যবহার করে ২০০ টিরও বেশি অস্ত্রোপচার করেছি এবং নির্ভুলতা ও স্থায়িত্ব অতুলনীয়। জরুরী পরিস্থিতিতে তাদের দ্রুত ডেলিভারি পরিষেবা জীবন রক্ষাকারী।",
      rating: 5,
      date: "2024-01-08",
      verified: true,
      category: "veterinary",
      categoryBn: "ভেটেরিনারি",
      helpfulCount: 203,
    },
    {
      id: 3,
      name: "Md. Abdul Karim",
      nameBn: "মোঃ আব্দুল করিম",
      role: "Poultry Farmer",
      roleBn: "পোল্ট্রি কৃষক",
      company: "Karim Poultry Farm",
      companyBn: "করিম পোল্ট্রি ফার্ম",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      content:
        "Their poultry equipment has revolutionized my farm operations. The feeding and watering systems are efficient and easy to maintain. Bird mortality has decreased by 40% since I started using their products.",
      contentBn:
        "তাদের পোল্ট্রি সরঞ্জাম আমার খামারের কাজে বিপ্লব এনেছে। খাদ্য ও জল সরবরাহের ব্যবস্থা দক্ষ এবং রক্ষণাবেক্ষণ সহজ। তাদের পণ্য ব্যবহার শুরু করার পর থেকে পাখির মৃত্যুহার ৪০% কমেছে।",
      rating: 4.5,
      date: "2024-01-05",
      verified: true,
      category: "poultry",
      categoryBn: "পোল্ট্রি",
      helpfulCount: 98,
    },
    {
      id: 4,
      name: "Dr. Nasrin Akter",
      nameBn: "ডাঃ নাসরিন আক্তার",
      role: "Lab Technician",
      roleBn: "ল্যাব টেকনিশিয়ান",
      company: "Vet Diagnostic Lab",
      companyBn: "ভেট ডায়াগনস্টিক ল্যাব",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      content:
        "The laboratory equipment I purchased from here is top-notch. The microscopes and testing kits are precise and reliable. It has greatly improved our diagnostic accuracy and turnaround time.",
      contentBn:
        "আমি এখান থেকে যে ল্যাবরেটরি সরঞ্জাম কিনেছি তা অসাধারণ। মাইক্রোস্কোপ এবং পরীক্ষার কিটগুলি নির্ভুল এবং বিশ্বস্ত। এটি আমাদের ডায়াগনস্টিক নির্ভুলতা এবং ফলাফল প্রদানের সময়কে ব্যাপকভাবে উন্নত করেছে।",
      rating: 5,
      date: "2024-01-03",
      verified: true,
      category: "lab",
      categoryBn: "ল্যাব",
      helpfulCount: 89,
    },
    {
      id: 5,
      name: "Md. Rashed Khan",
      nameBn: "মোঃ রাশেদ খান",
      role: "Farm Manager",
      roleBn: "ফার্ম ম্যানেজার",
      company: "Modern Dairy Solutions",
      companyBn: "মডার্ন ডেইরি সলিউশনস",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      content:
        "I've been a loyal customer for 3 years. Their AI supplies and dairy machinery are excellent quality. The after-sales support is amazing, and the technicians are very knowledgeable. Highly recommended for any serious farmer.",
      contentBn:
        "আমি ৩ বছর ধরে একজন অনুগত গ্রাহক। তাদের কৃত্রিম প্রজনন সরবরাহ এবং ডেইরি যন্ত্রপাতি চমৎকার মানের। বিক্রয়োত্তর সহায়তা আশ্চর্যজনক এবং প্রযুক্তিবিদরা অত্যন্ত জ্ঞানী। যে কোনো গুরুতর কৃষকের জন্য অত্যন্ত সুপারিশ করা হচ্ছে।",
      rating: 5,
      date: "2023-12-30",
      verified: true,
      category: "dairy",
      categoryBn: "ডেইরি",
      helpfulCount: 145,
    },
    {
      id: 6,
      name: "Dr. Farhana Islam",
      nameBn: "ডাঃ ফারহানা ইসলাম",
      role: "Animal Nutritionist",
      roleBn: "পশু পুষ্টিবিদ",
      company: "NutriVet Solutions",
      companyBn: "নিউট্রিভেট সলিউশনস",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop",
      content:
        "The supplements and nutritional products are scientifically formulated and have shown remarkable results in my animal nutrition programs. The delivery is always on time, and the packaging is excellent.",
      contentBn:
        "সাপ্লিমেন্ট এবং পুষ্টি পণ্যগুলি বৈজ্ঞানিকভাবে প্রণয়ন করা হয়েছে এবং আমার পশু পুষ্টি কর্মসূচিতে উল্লেখযোগ্য ফলাফল দেখিয়েছে। ডেলিভারি সবসময় সময়মতো হয় এবং প্যাকেজিং চমৎকার।",
      rating: 4.5,
      date: "2023-12-28",
      verified: true,
      category: "nutrition",
      categoryBn: "পুষ্টি",
      helpfulCount: 78,
    },
    {
      id: 7,
      name: "Md. Zakir Hossain",
      nameBn: "মোঃ জাকির হোসেন",
      role: "AI Specialist",
      roleBn: "কৃত্রিম প্রজনন বিশেষজ্ঞ",
      company: "Breeding Excellence",
      companyBn: "ব্রিডিং এক্সিলেন্স",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      content:
        "Their AI equipment and supplies are the best in the market. The semen straws and AI guns are of superior quality, ensuring high success rates in our breeding program. A game-changer for our farm.",
      contentBn:
        "তাদের কৃত্রিম প্রজনন সরঞ্জাম এবং সরবরাহ বাজারে সেরা। সিমেন স্ট্র এবং এআই বন্দুকগুলি উচ্চ মানের, আমাদের প্রজনন কর্মসূচিতে উচ্চ সাফল্যের হার নিশ্চিত করে। আমাদের খামারের জন্য একটি গেম-চেঞ্জার।",
      rating: 5,
      date: "2023-12-25",
      verified: true,
      category: "ai",
      categoryBn: "কৃত্রিম প্রজনন",
      helpfulCount: 167,
    },
    {
      id: 8,
      name: "Dr. Mahmud Hasan",
      nameBn: "ডাঃ মাহমুদ হাসান",
      role: "Veterinary Consultant",
      roleBn: "ভেটেরিনারি কনসালট্যান্ট",
      company: "Animal Health Services",
      companyBn: "অ্যানিমেল হেলথ সার্ভিসেস",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      content:
        "I've been recommending this platform to all my veterinary colleagues. The range of products, competitive pricing, and exceptional customer service make them the go-to choice for veterinary supplies in Bangladesh.",
      contentBn:
        "আমি আমার সকল ভেটেরিনারি সহকর্মীদের কাছে এই প্ল্যাটফর্মটি সুপারিশ করছি। পণ্যের পরিসর, প্রতিযোগিতামূলক মূল্য এবং অসাধারণ গ্রাহক পরিষেবা তাদের বাংলাদেশে ভেটেরিনারি সরবরাহের জন্য পছন্দের বিকল্প করে তুলেছে।",
      rating: 5,
      date: "2023-12-20",
      verified: true,
      category: "veterinary",
      categoryBn: "ভেটেরিনারি",
      helpfulCount: 210,
    },
  ];

  const categories = [
    { id: "all", label: "All Testimonials" },
    { id: "dairy", label: "Dairy Farming" },
    { id: "poultry", label: "Poultry Farming" },
    { id: "veterinary", label: "Veterinary" },
    { id: "ai", label: "AI Supplies" },
    { id: "lab", label: "Veterinary Lab" },
    { id: "nutrition", label: "Animal Nutrition" },
  ];

  const filteredTestimonials = testimonials.filter(
    (t) => selectedCategory === "all" || t.category === selectedCategory,
  );

  const totalItems = filteredTestimonials.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!isPaused && totalItems > 0) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, nextSlide, totalItems]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  const currentTestimonial = filteredTestimonials[activeIndex];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />,
      );
    }

    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (totalItems === 0) {
    return (
      <section className="container py-8 md:py-12">
        <div className="text-center py-12">
          <p className="text-slate-500">
            No testimonials found in this category.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Quote className="w-4 h-4" />
          Testimonials
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          What Our Farmers Say
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Real stories from farmers, veterinarians, and farm professionals who
          trust our products
        </p>
      </div>

      {/* Testimonial Display */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left - Avatar & Info */}
            <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 md:p-8 text-white flex flex-col items-center justify-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mb-4">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-center">
                {currentTestimonial.name}
              </h3>
              <p className="text-sm text-emerald-100 text-center">
                {currentTestimonial.nameBn}
              </p>

              <div className="mt-2 text-center">
                <p className="text-sm font-semibold">
                  {currentTestimonial.role}
                </p>
                <p className="text-xs text-emerald-100">
                  {currentTestimonial.roleBn}
                </p>
              </div>

              <div className="mt-2 text-center">
                <p className="text-sm font-medium">
                  {currentTestimonial.company}
                </p>
                <p className="text-xs text-emerald-100">
                  {currentTestimonial.companyBn}
                </p>
              </div>

              {currentTestimonial.verified && (
                <div className="mt-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  <Award className="w-3 h-3" />
                  Verified Customer
                </div>
              )}

              <div className="mt-4 flex items-center gap-1">
                {renderStars(currentTestimonial.rating)}
                <span className="text-xs ml-1">
                  ({currentTestimonial.rating})
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-emerald-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(currentTestimonial.date)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {currentTestimonial.helpfulCount} helpful
                </span>
              </div>
            </div>

            {/* Right - Testimonial Content */}
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-200" />
                <div className="pl-8">
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-4">
                    "{currentTestimonial.content}"
                  </p>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    "{currentTestimonial.contentBn}"
                  </p>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mt-4 flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {currentTestimonial.categoryBn}
                </span>
                <span className="text-xs text-slate-400">
                  Posted on {formatDate(currentTestimonial.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6 gap-4">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          {/* Indicators */}
          <div className="flex gap-1.5 flex-1 justify-center">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  rounded-full transition-all duration-300
                  ${
                    activeIndex === index
                      ? "w-8 h-2 bg-emerald-600"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }
                `}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-3 text-xs text-slate-400">
          {activeIndex + 1} of {totalItems} testimonials
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">1,200+</div>
          <div className="text-xs text-slate-500">Happy Customers</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">98%</div>
          <div className="text-xs text-slate-500">Satisfaction Rate</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">4.8/5</div>
          <div className="text-xs text-slate-500">Average Rating</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-100 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">500+</div>
          <div className="text-xs text-slate-500">Verified Reviews</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-10 bg-emerald-50 rounded-2xl p-6 md:p-8 text-center border border-emerald-100">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Share Your Experience
        </h3>
        <p className="text-sm text-slate-600 mb-4 max-w-lg mx-auto">
          Have you used our products? We'd love to hear your feedback and
          feature your story here.
        </p>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-md hover:shadow-lg">
          Write a Testimonial
        </button>
      </div>
    </section>
  );
}
