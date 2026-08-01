// src/components/BlogCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IBlog } from "../services/blogService";

interface BlogCardProps {
  blog: IBlog;
  catColor: (name?: string) => string;
  authorAvatar: (name?: string) => string;
  formatDate: (d?: string) => string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  catColor,
  formatDate,
}) => {
  const catName = blog.category?.category_name;
  const FALLBACK_IMAGE = "/placeholder-blog.jpg";

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <Image
          src={blog.image || FALLBACK_IMAGE}
          width={400}
          height={400}
          alt={blog.title || "Blog Post"}
          className="w-full  h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        {catName && (
          <span
            className={`self-start text-xs font-semibold px-2.5 py-1 rounded-md mb-3 ${catColor(
              catName,
            )}`}
          >
            {catName}
          </span>
        )}

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="text-gray-900 font-semibold text-base leading-snug mb-2 group-hover:text-[#059669] transition-colors duration-200 cursor-pointer line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
          {blog.content}
        </p>

        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div>
              <p className="text-xs font-semibold text-gray-700 leading-none">
                {blog.author_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(blog.created_at)}
              </p>
            </div>
          </div>

          {blog.read_time && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {blog.read_time}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
