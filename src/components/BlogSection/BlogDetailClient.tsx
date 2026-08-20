/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogCard } from "./BlogCard";
import { IBlog } from "../services/blogService";

interface ISection {
  heading: string;
  body?: string;
  titles?: string[];
  image?: string;
  bullets?: Array<{ title: string; text: string }>;
}

interface BlogDetailClientProps {
  blog: IBlog;
  sections: ISection[];
  related: IBlog[];
}

const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_PATH || "";

function blogImg(path?: string | null) {
  if (!path) return null;
  return path.startsWith("http") ? path : IMG_BASE + path;
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

function catColor() {
  return "bg-indigo-50 text-[#059669]";
}

function shareUrl(platform: string, url: string, title: string) {
  const enc = encodeURIComponent;
  if (platform === "Facebook")
    return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  if (platform === "Twitter")
    return `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
  if (platform === "LinkedIn")
    return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
  return "#";
}

function processSectionBodyHtml(
  html?: string,
  sectionIdx?: number,
  titles?: string[],
) {
  if (!html) return "";
  if (!Array.isArray(titles) || titles.length === 0) return html;

  let processedHtml = html;

  titles.forEach((title, titleIdx) => {
    const subId = `toc-section-${sectionIdx}-sub-${titleIdx}`;
    const regex = new RegExp(
      `(>(?:<[^>]+>)*\\s*)(${title.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})(\\s*(?:<[^>]+>)*<)`,
      "gi",
    );

    if (regex.test(processedHtml)) {
      processedHtml = processedHtml.replace(
        regex,
        `$1<span id="${subId}" class="scroll-mt-28 inline-block w-full">$2</span>$3`,
      );
    }
  });

  return processedHtml;
}

export default function BlogDetailClient({
  blog,
  sections,
  related,
}: BlogDetailClientProps) {
  const [activeSection, setActiveSection] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  const isClickScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // Set default initial active section
  useEffect(() => {
    if (!sections?.length) return;
    const firstSec = sections[0];
    const tocEntries =
      Array.isArray(firstSec.titles) && firstSec.titles.length > 0
        ? firstSec.titles
        : [firstSec.heading];
    const initialId =
      tocEntries.length > 1 ? `toc-section-0-sub-0` : `toc-section-0`;
    setActiveSection(initialId);
  }, [sections]);

  // Combined Active State Scroll Handler
  useEffect(() => {
    if (!sections?.length) return;

    const allTargetIds: string[] = [];
    sections.forEach((sec, sectionIdx) => {
      const titles =
        Array.isArray(sec.titles) && sec.titles.length > 0
          ? sec.titles
          : [sec.heading];
      if (titles.length > 1) {
        titles.forEach((_, titleIdx) => {
          allTargetIds.push(`toc-section-${sectionIdx}-sub-${titleIdx}`);
        });
      } else {
        allTargetIds.push(`toc-section-${sectionIdx}`);
      }
    });

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const scrollPosition = window.scrollY + 120;
      let currentActive = allTargetIds[0];

      for (const id of allTargetIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top - 20) {
            currentActive = id;
          }
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    isClickScrolling.current = true;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    scrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  const heroImg = blogImg(blog.image);
  const avatar = authorAvatar(blog.author_name);
  const tags = blog.tags || [];
  const categoryName = blog.category?.category_name;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#059669] transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/bn/blog"
            className="hover:text-[#059669] transition-colors"
          >
            Blog
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">
            {blog.title || blog.slug}
          </span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {categoryName && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-[#059669]">
              {categoryName}
            </span>
          )}
          <span className="text-sm text-gray-400">
            {formatDate(blog.created_at)}
          </span>
          {blog.read_time && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{blog.read_time}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4 max-w-4xl">
          {blog.title ||
            blog.slug
              ?.replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()) ||
            "Untitled"}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-gray-500 max-w-3xl mb-8 leading-relaxed">
            {blog.excerpt}
          </p>
        )}

        {/* Author Row */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-gray-200">
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {blog.author_name || "TizaraERP"}
            </p>
            <p className="text-xs text-gray-400">ERP Specialist</p>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT — Body */}
          <article className="flex-1 min-w-0">
            {heroImg ? (
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${blog.image}?v=${blog.updated_at}`}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-72 sm:h-96 rounded-2xl mb-10 bg-linear-to-br from-indigo-100 to-violet-100" />
            )}

            <div className="space-y-12">
              {sections?.map((section, index) => {
                const sectionId = `toc-section-${index}`;
                const sectionImg = blogImg(section.image);
                const hasHTML = section.body?.trimStart().startsWith("<");
                const processedBody = hasHTML
                  ? processSectionBodyHtml(section.body, index, section.titles)
                  : section.body;

                return (
                  <section
                    key={sectionId}
                    id={sectionId}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 rounded-full bg-[#059669] inline-block shrink-0" />
                      {section.heading}
                    </h2>

                    {section.body &&
                      (hasHTML ? (
                        <div
                          className="text-gray-600 leading-relaxed text-base blog-body"
                          dangerouslySetInnerHTML={{ __html: processedBody ?? "" }}
                        />
                      ) : (
                        section.body
                          .split("\n")
                          .filter(Boolean)
                          .map((para, i) => (
                            <p
                              key={i}
                              className="text-gray-600 leading-relaxed text-base mb-4"
                            >
                              {para}
                            </p>
                          ))
                      ))}

                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="space-y-4 mt-2">
                        {section.bullets.map((b, i) => (
                          <li
                            key={i}
                            className="flex gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                          >
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-[#059669] shrink-0" />
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {b.title}:{" "}
                              </span>
                              <span className="text-gray-600 text-sm">
                                {b.text}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sectionImg && (
                      <div className="relative w-full h-56 rounded-xl overflow-hidden mt-6 shadow-sm">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_PATH}/${section?.image}`}
                          alt={section.heading}
                          fill
                          className="object-cover"
                          sizes="800px"
                        />
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-14 pt-8 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-indigo-50 hover:text-[#059669] cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-indigo-50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-700">
                Share this article
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Facebook", icon: "f" },
                  { label: "Twitter", icon: "t" },
                  { label: "LinkedIn", icon: "in" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={shareUrl(s.label, pageUrl, blog.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-[#059669] hover:text-white hover:border-transparent transition-all shadow-sm flex items-center justify-center"
                    aria-label={`Share on ${s.label}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-5 items-start">
              <Image
                width={80}
                height={80}
                src={avatar}
                alt={blog.author_name || "Author"}
                className="w-16 h-16 rounded-full object-cover shrink-0 ring-4 ring-indigo-50"
              />
              <div>
                <p className="font-bold text-gray-900">
                  {blog.author_name || "TizaraERP"}
                </p>
                <p className="text-xs text-[#059669] mb-2">ERP Specialist</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Experienced professional helping businesses modernize their
                  operations through tailored ERP and digital transformation
                  strategies.
                </p>
              </div>
            </div>
          </article>

          {/* RIGHT — Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {sections.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-[#059669] px-5 py-3">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">
                      Table of Contents
                    </p>
                  </div>

                  <ul className="divide-y divide-gray-50">
                    {(() => {
                      let counter = 0;
                      return sections?.flatMap((section, sectionIdx) => {
                        const tocEntries =
                          Array.isArray(section.titles) &&
                          section.titles.length > 0
                            ? section.titles
                            : [section.heading];

                        return tocEntries.map((label, titleIdx) => {
                          counter += 1;
                          const num = counter;

                          const targetId =
                            tocEntries.length > 1
                              ? `toc-section-${sectionIdx}-sub-${titleIdx}`
                              : `toc-section-${sectionIdx}`;

                          const isActive = activeSection === targetId;

                          return (
                            <li key={`${sectionIdx}-${titleIdx}`}>
                              <button
                                type="button"
                                onClick={() => scrollTo(targetId)}
                                className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-all duration-150 group ${
                                  isActive ? "bg-indigo-50" : "hover:bg-gray-50"
                                }`}
                              >
                                <span
                                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                                    isActive
                                      ? "bg-[#059669] text-white"
                                      : "bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-[#059669]"
                                  }`}
                                >
                                  {num}
                                </span>

                                <span
                                  className={`flex-1 text-sm leading-snug transition-colors ${
                                    isActive
                                      ? "text-[#059669] font-bold"
                                      : "text-gray-600 group-hover:text-gray-900"
                                  }`}
                                >
                                  {label}
                                </span>

                                <span
                                  className={`shrink-0 mt-0.5 transition-all duration-150 ${
                                    isActive
                                      ? "text-[#059669] translate-x-1"
                                      : "text-gray-300 group-hover:text-green-400 group-hover:translate-x-0.5"
                                  }`}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                  >
                                    <path
                                      d="M5 3l4 4-4 4"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </li>
                          );
                        });
                      });
                    })()}
                  </ul>
                </div>
              )}

              {/* Quick Related */}
              {related.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Related Articles
                  </p>
                  <ul className="space-y-4">
                    {related.slice(0, 2).map((r) => {
                      const rImg = blogImg(r.image);
                      return (
                        <li key={r.slug || r.id}>
                          <Link
                            href={`/bn/blog/${r.slug}`}
                            className="flex gap-3 group cursor-pointer"
                          >
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              {rImg ? (
                                <Image
                                  src={rImg}
                                  alt={r.title}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full bg-linear-to-br from-indigo-100 to-violet-100" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-400 mb-0.5">
                                {formatDate(r.created_at)}
                              </p>
                              <p className="text-sm font-semibold text-gray-700 group-hover:text-[#059669] transition-colors line-clamp-2 leading-snug">
                                {r.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Bottom Related Section */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Articles
              </h2>
              <Link
                href="/bn/blog"
                className="text-sm text-[#059669] font-medium hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((r) => (
                <BlogCard
                  key={r.slug || r.id}
                  blog={r}
                  catColor={catColor}
                  authorAvatar={authorAvatar}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
