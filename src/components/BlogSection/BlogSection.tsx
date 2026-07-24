"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import {
  getBlogCategories,
  getBlogs,
  IBlog,
  IBlogCategory,
} from "../services/blogService";

const CATEGORY_COLOR_LIST = [
  "bg-blue-50 text-blue-600",
  "bg-amber-50 text-amber-600",
  "bg-green-50 text-green-600",
  "bg-indigo-50 text-[#059669]",
  "bg-rose-50 text-rose-600",
  "bg-purple-50 text-purple-600",
  "bg-teal-50 text-teal-600",
];

function catColor(name?: string) {
  if (!name) return "bg-gray-100 text-gray-600";
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return CATEGORY_COLOR_LIST[h % CATEGORY_COLOR_LIST.length];
}

function authorAvatar(name?: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Author",
  )}&background=059669&color=fff&size=128&bold=true&rounded=true&format=png`;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const BlogSkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-3 w-20 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 bg-gray-100 rounded" />
      <div className="h-3 bg-gray-100 rounded" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
    </div>
  </div>
);

const LIMIT = 9;

export default function BlogPage() {
  const [categories, setCategories] = useState<IBlogCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Keep refs fresh to avoid stale closures in IntersectionObserver
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Load Categories on Mount
  useEffect(() => {
    async function loadCategories() {
      setCatLoading(true);
      const data = await getBlogCategories();
      setCategories(data);
      setCatLoading(false);
    }
    loadCategories();
  }, []);

  // Fetch blogs when category or page changes
  useEffect(() => {
    async function fetchBlogs() {
      // Set loading state based on page
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }

      try {
        const response = await getBlogs({
          page,
          limit: LIMIT,
          categoryId: activeCategoryId,
        });

        //  IMPORTANT: response.data contains the blogs array
        const newBlogs = response.data || [];
        const hasMoreData = response.meta?.has_more || false;

        if (page === 1) {
          setBlogs(newBlogs);
        } else {
          setBlogs((prev) => [...prev, ...newBlogs]);
        }

        setHasMore(hasMoreData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        if (page === 1) {
          setBlogs([]);
        }
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    }

    fetchBlogs();
  }, [page, activeCategoryId]);

  // Category switch handler
  const handleCategoryChange = (id: string) => {
    if (activeCategoryId === id) return;
    setActiveCategoryId(id);
    setBlogs([]);
    setPage(1);
  };

  // Intersection Observer Callback for Infinite Scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" },
    );

    observerRef.current.observe(node);
  }, []);

  // Cleanup Observer
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ── HERO HEADER ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase text-[#059669] bg-indigo-50 rounded-full mb-4">
            Our Blog
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Insights for Modern Businesses
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Practical guides, industry news, and ERP strategies to help your
            business grow faster and operate smarter.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── CATEGORY TABS ── */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeCategoryId === "all"
                ? "bg-[#059669] text-white border-[#059669] shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-[#059669]"
            }`}
          >
            All
          </button>

          {catLoading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-24 animate-pulse rounded-full bg-gray-200"
                />
              ))
            : categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategoryId === cat.id
                      ? "bg-[#059669] text-white border-[#059669] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-[#059669]"
                  }`}
                >
                  {cat.category_name}
                </button>
              ))}
        </div>

        {/* ── BLOG GRID AND STATES ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogSkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-base">
              No articles in this category yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  catColor={catColor}
                  authorAvatar={authorAvatar}
                  formatDate={formatDate}
                />
              ))}

              {isFetching &&
                [...Array(3)].map((_, i) => (
                  <BlogSkeletonCard key={`skeleton-${i}`} />
                ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && <div ref={loadMoreRef} className="h-10 w-full" />}

            {/* End of Feed */}
            {!hasMore && blogs.length > 0 && (
              <p className="text-center text-gray-400 text-sm mt-10">
                — You&apos;ve read it all —
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
