"use client";

import { useState, useRef } from "react";

import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";

export interface ITestimonial {
  id: string;
  name: string;
  designation: string;
  image: string;
  description: string;
  rating: string;
  performance: number;
  created_at: string;
  updated_at: string;
}

interface TestimonialSectionProps {
  testimonials: ITestimonial[];
}

export default function TestimonialSection({
  testimonials = [],
}: TestimonialSectionProps) {
  const INITIAL_CARDS = 6; // Initial cards to show and step count
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARDS);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalItems = testimonials.length;
  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < totalItems;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + INITIAL_CARDS, totalItems));
  };

  const handleSeeLess = () => {
    setVisibleCount(INITIAL_CARDS);
    // Smooth scroll back to the section top when collapsing
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (totalItems === 0) {
    return (
      <section className="container py-8 md:py-12">
        <div className="text-center py-12">
          <p className="text-slate-500">
            No testimonials available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="container py-8 md:py-12 scroll-mt-6">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Quote className="w-4 h-4" />
          Testimonials
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          What Our Clients Say
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Real stories from partners and clients who trust our platform
        </p>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTestimonials?.map((item) => (
          <TestimonialCard key={item?.id} item={item} />
        ))}
      </div>

      {/* Action Controls: See More / See Less */}
      {totalItems > INITIAL_CARDS && (
        <div className="text-center mt-10">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>See More ({totalItems - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSeeLess}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95"
            >
              <span>See Less</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
