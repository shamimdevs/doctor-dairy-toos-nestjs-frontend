"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { getThumbnail, getYoutubeWatchUrl } from "./VideoGallery";
import { IVideoGallary } from "../services/videoService";

interface HomeVideoSectionProps {
  videos: IVideoGallary[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const HomeVideoSection: React.FC<HomeVideoSectionProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Play className="w-4 h-4 fill-emerald-600" />
          ভিডিও গ্যালারি
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          আমাদের শিক্ষামূলক ভিডিও দেখুন
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          আমাদের বিশেষজ্ঞ পশুচিকিৎসক ও খামার বিশেষজ্ঞদের কাছ থেকে তথ্যবহুল
          ভিডিওর মাধ্যমে শিখুন
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            getThumbnail={getThumbnail}
            getYoutubeWatchUrl={getYoutubeWatchUrl}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* See More */}
      <div className="flex justify-center mt-10">
        <Link
          href="/videos"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
        >
          আরও দেখুন
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default HomeVideoSection;
