"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface HeroBanner {
  id: string;
  title: string;
  image_url: string;
  redirect_url?: string;
}

interface HeroSectionProps {
  sliderBanners?: HeroBanner[];
  sideBanners?: HeroBanner[];
}

export default function HeroSection({
  sliderBanners = [],
  sideBanners = [],
}: HeroSectionProps) {
  const slides = sliderBanners;
  const sideCards = sideBanners.slice(0, 2);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
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
    if (!isPaused && slides.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, nextSlide, slides.length]);

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
            h-70
            sm:h-85
            lg:h-105
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
          {slides.length > 0 && (
            <>
              {/* Slides Track */}
              <div
                className="relative flex w-full h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {slides.map((slide, index) => {
                  const image = (
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className=""
                      priority={index === 0}
                    />
                  );

                  return (
                    <div
                      key={slide.id}
                      className="min-w-full h-full relative overflow-hidden bg-slate-800"
                      aria-hidden={current !== index}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Slide ${index + 1} of ${slides.length}`}
                    >
                      {slide.redirect_url ? (
                        <Link
                          href={slide.redirect_url}
                          className="block relative w-full h-full"
                          aria-label={slide.title}
                        >
                          {image}
                        </Link>
                      ) : (
                        image
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              {slides.length > 1 && (
                <>
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
                </>
              )}
            </>
          )}
        </div>

        {/* Right Side Cards: Spans 2 Columns out of 6 (max 2 banners) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-2 gap-4 items-stretch">
          {sideCards.map((card) => {
            const image = (
              <Image
                src={card.image_url}
                alt={card.title}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className=""
              />
            );

            return (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-2xl shadow-lg min-h-32.5 lg:h-auto bg-slate-100"
              >
                {card.redirect_url ? (
                  <Link
                    href={card.redirect_url}
                    className="block relative w-full h-full"
                    aria-label={card.title}
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
