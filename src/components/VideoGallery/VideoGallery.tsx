"use client";

import { useState, useMemo } from "react";
import { Play } from "lucide-react";
import { VideoCard, VideoGallary } from "./VideoCard";

interface VideoCategory {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VideoGalleryProps {
  videos?: VideoGallary[];
  categories?: VideoCategory[];
}

// Utility: Extract YouTube Video ID from URL safely
export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Utility: Get thumbnail with guaranteed hqdefault fallback
export const getThumbnail = (video: VideoGallary): string => {
  if (video.thumbnail) return video.thumbnail;
  const youtubeId = getYoutubeId(video.video_url);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return "/placeholder-video.jpg";
};

// Utility: Get YouTube watch URL for direct navigation
export const getYoutubeWatchUrl = (url: string): string => {
  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }
  return url;
};

export default function VideoGallery({
  videos = [],
  categories = [],
}: VideoGalleryProps) {
  const [filter, setFilter] = useState("all");

  // Derive categories directly during render (No useEffect needed)
  const allCategories = useMemo(() => {
    if (categories.length === 0) return [];

    return [
      { id: "all", label: "সব ভিডিও" },
      ...categories.map((cat) => ({
        id: cat.id,
        label: cat.title,
      })),
    ];
  }, [categories]);

  const filteredVideos =
    filter === "all"
      ? videos
      : videos.filter((video) => video.video_gallary_category_id === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (videos.length === 0) {
    return (
      <section className="container py-8 md:py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            ভিডিও গ্যালারি
          </h2>
          <p className="text-slate-500">এই মুহূর্তে কোনো ভিডিও নেই।</p>
        </div>
      </section>
    );
  }

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

      {/* Category Filters */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`
                px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-all duration-300
                ${
                  filter === cat.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">
            এই ক্যাটাগরিতে কোনো ভিডিও পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              getThumbnail={getThumbnail}
              getYoutubeWatchUrl={getYoutubeWatchUrl}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
