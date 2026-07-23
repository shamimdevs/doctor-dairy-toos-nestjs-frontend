"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ExternalLink, Calendar } from "lucide-react";

// Types
export interface VideoGalleryCategory {
  id?: string;
  title?: string;
}

export interface VideoGallary {
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
  videoGallaryCategory: VideoGalleryCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface VideoCardProps {
  video: VideoGallary;
  getThumbnail: (video: VideoGallary) => string;
  getYoutubeWatchUrl: (url: string) => string;
  formatDate: (dateString: string) => string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  getThumbnail,
  getYoutubeWatchUrl,
  formatDate,
}) => {
  const thumbnail = getThumbnail(video);
  const watchUrl = getYoutubeWatchUrl(video.video_url);

  return (
    <Link
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer block"
    >
      {/* Thumbnail Container */}
      <div className="relative h-72 w-full overflow-hidden bg-slate-900">
        <Image
          src={thumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-video.jpg";
          }}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-emerald-600 fill-emerald-600 ml-1" />
          </div>
        </div>

        {/* Watch Indicator */}
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
        <p className="text-xs text-slate-500 mt-4 mb-2 line-clamp-2">
          {video.description}
        </p>
        <div className="flex mt-4 items-center justify-between text-xs text-slate-400">
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
};
