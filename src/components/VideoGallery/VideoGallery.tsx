"use client";

import { useState, useEffect } from "react";
import { Play, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Video type from API
interface VideoGallary {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  video_url: string;
  added_by: string;
  addedBy: {
    id: string;
    name: string;
    email: string;
  };
  video_gallary_category_id: string;
  videoGallaryCategory: {
    id: string;
    title: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Category type from API
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

export default function VideoGallery({
  videos = [],
  categories = [],
}: VideoGalleryProps) {
  const [filter, setFilter] = useState("all");
  const [allCategories, setAllCategories] = useState<
    { id: string; label: string }[]
  >([]);

  // Set up categories when props change
  useEffect(() => {
    if (categories.length > 0) {
      const catList = [
        { id: "all", label: "All Videos" },
        ...categories.map((cat) => ({
          id: cat.id,
          label: cat.title,
        })),
      ];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllCategories(catList);
    }
  }, [categories]);

  // Extract YouTube ID from URL
  const getYoutubeId = (url: string): string => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Get thumbnail from YouTube or use fallback
  const getThumbnail = (video: VideoGallary) => {
    if (video.thumbnail) return video.thumbnail;
    const youtubeId = getYoutubeId(video.video_url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return "/placeholder-video.jpg";
  };

  // Get YouTube watch URL for direct link
  const getYoutubeWatchUrl = (url: string): string => {
    const youtubeId = getYoutubeId(url);
    if (youtubeId) {
      return `https://www.youtube.com/watch?v=${youtubeId}`;
    }
    return url;
  };

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
            Video Gallery
          </h2>
          <p className="text-slate-500">No videos available at the moment.</p>
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
          Video Gallery
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          Watch Our Educational Videos
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Learn from our expert veterinarians and farm specialists through
          informative video content
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
          <p className="text-slate-500">No videos found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredVideos?.map((video) => {
            const thumbnail = getThumbnail(video);
            const watchUrl = getYoutubeWatchUrl(video.video_url);

            return (
              <Link
                key={video.id}
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer block"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <Image
                    src={thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-video.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-emerald-600 fill-emerald-600 ml-1" />
                    </div>
                  </div>

                  {/* YouTube Badge */}
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" />
                    YouTube
                  </div>

                  {/* Open in New Tab Indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Watch
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(video.created_at)}
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">
                      {video.videoGallaryCategory?.title || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
