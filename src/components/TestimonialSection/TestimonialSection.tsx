"use client";

import { useMemo } from "react";

import { Quote } from "lucide-react";
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

interface MarqueeRowProps {
  items: ITestimonial[];
  direction: "left" | "right";
}

// Duration scales with row length so speed feels consistent no matter how
// many cards are in a row (longer row = longer loop, same visual speed).
const SECONDS_PER_CARD = 6;
const MIN_DURATION_SECONDS = 20;

function MarqueeRow({ items, direction }: MarqueeRowProps) {
  // Duplicated so the track can loop seamlessly from -50% back to 0%.
  const track = [...items, ...items];
  const duration = Math.max(
    items.length * SECONDS_PER_CARD,
    MIN_DURATION_SECONDS,
  );

  return (
    <div className="marquee-row relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div
        className={`marquee-track flex w-max gap-6 ${
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="h-full md:h-72 py-2 w-75 sm:w-85 shrink-0"
          >
            <TestimonialCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialSection({
  testimonials = [],
}: TestimonialSectionProps) {
  const totalItems = testimonials.length;

  // Split into two rows so the top and bottom marquees show different cards.
  const { topRow, bottomRow } = useMemo(() => {
    if (totalItems === 0) return { topRow: [], bottomRow: [] };
    const mid = Math.ceil(totalItems / 2);
    const top = testimonials.slice(0, mid);
    const bottom = testimonials.slice(mid);
    return { topRow: top, bottomRow: bottom.length > 0 ? bottom : top };
  }, [testimonials, totalItems]);

  if (totalItems === 0) {
    return (
      <section className="container py-8 md:py-12">
        <div className="text-center py-12">
          <p className="text-slate-500">
            এই মুহূর্তে কোনো গ্রাহক মতামত নেই।
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className=" py-8 md:py-12 scroll-mt-6">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Quote className="w-4 h-4" />
          গ্রাহক মতামত
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          আমাদের গ্রাহকরা যা বলেন
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          যারা আমাদের প্ল্যাটফর্মে আস্থা রাখেন তাদের প্রকৃত অভিজ্ঞতা
        </p>
      </div>

      {/* Infinite two-direction marquee */}
      <div className="space-y-6">
        <MarqueeRow items={topRow} direction="left" />
        {bottomRow !== topRow && (
          <MarqueeRow items={bottomRow} direction="right" />
        )}
      </div>
    </section>
  );
}
