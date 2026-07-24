/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import Link from "next/link";

import {
  ChevronLeft,
  Calendar,
  User,
  Clock,
  BookOpen,
  Tag,
  ArrowRight,
  FileText,
  List,
  CircleDot,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author_name: string;
  read_time: string;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    category_name: string;
  };
  category_id: string;
  is_featured: boolean;
  tags?: string[];
  meta_description?: string;
  meta_title?: string;
  status: boolean;
  excerpt: string | null;
  position: number;
  added_by: string;
}

interface BlogSection {
  id: string;
  blog_id: string;
  image?: string;
  section_key?: string;
  heading: string;
  body: string;
  titles?: string[] | string;
  bullets?: Array<{ title: string; text: string }> | string;
  position: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  image: string;
  created_at: string;
  author_name: string;
  read_time: string;
  category: {
    category_name: string;
  };
}

interface BlogDetailsProps {
  post: BlogPost;
  sections?: BlogSection[];
  related?: RelatedBlog[];
}

export default function BlogDetails({
  post,
  sections = [],
  related = [],
}: BlogDetailsProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format date for English
  const formatDateEn = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get reading time
  const getReadTime = () => {
    if (post.read_time) return `${post.read_time} min read`;
    if (post.content) {
      const words = post.content.split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      return `${minutes} min read`;
    }
    return "5 min read";
  };

  // Parse titles - handle string or array
  const parseTitles = (titles: any): string[] => {
    if (!titles) return [];
    if (Array.isArray(titles)) {
      // If it's an array of strings, return as is
      return titles.map((t) => (typeof t === "string" ? t : String(t)));
    }
    if (typeof titles === "string") {
      try {
        const parsed = JSON.parse(titles);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If it's a comma-separated string
        if (titles.includes(",")) {
          return titles.split(",").map((t) => t.trim());
        }
        return [titles];
      }
    }
    return [];
  };

  // Parse bullets - handle string or array
  const parseBullets = (
    bullets: any,
  ): Array<{ title: string; text: string }> => {
    if (!bullets) return [];
    if (Array.isArray(bullets)) return bullets;
    if (typeof bullets === "string") {
      try {
        const parsed = JSON.parse(bullets);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Back Button */}
      <button className="group flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition-colors">
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-medium">Back to Blog</span>
      </button>

      {/* Category Badge */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {post.category?.category_name && (
          <Link
            href={`/blog/category/${post.category.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors"
          >
            <Tag size={14} />
            {post.category.category_name}
          </Link>
        )}
        {post.is_featured && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-100">
            <BookOpen size={14} />
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-emerald-500" />
          <span>{formatDate(post.created_at)}</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <User size={16} className="text-emerald-500" />
          <span className="font-medium text-slate-700">
            {post.author_name || "Admin"}
          </span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-emerald-500" />
          <span>{getReadTime()}</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">|</span>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-8 bg-slate-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className=""
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-lg prose-emerald max-w-none">
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Blog Sections (from blog-details API) */}
      {sections && sections.length > 0 && (
        <div className="mt-10 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FileText size={24} className="text-emerald-500" />
            বিস্তারিত আলোচনা
          </h2>
          <div className="space-y-8">
            {sections.map((section, index) => {
              const titles = parseTitles(section.titles);
              const bullets = parseBullets(section.bullets);

              return (
                <div
                  key={section.id || index}
                  id={section.section_key || `section-${index}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  {section.heading && (
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {section.heading}
                    </h3>
                  )}

                  {section.image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-100">
                      <Image
                        src={section.image}
                        alt={section.heading || "Section image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {section.body && (
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-4">
                      {section.body}
                    </div>
                  )}

                  {/* Titles/Sub-sections */}
                  {titles.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <List size={16} className="text-emerald-500" />
                        বিষয়বস্তু:
                      </h4>
                      <ul className="space-y-1 pl-4">
                        {titles.map((title, idx) => (
                          <li
                            key={idx}
                            className="text-slate-600 text-sm flex items-start gap-2"
                          >
                            <CircleDot
                              size={12}
                              className="text-emerald-500 mt-1 shrink-0"
                            />
                            {title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bullets */}
                  {bullets.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <CircleDot size={16} className="text-emerald-500" />
                        গুরুত্বপূর্ণ তথ্য:
                      </h4>
                      <ul className="space-y-2">
                        {bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100"
                          >
                            <span className="font-semibold text-emerald-700">
                              {bullet.title}:
                            </span>
                            <span className="text-slate-600 ml-2">
                              {bullet.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Section */}
      <div className="mt-8 p-6 bg-linear-to-r from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {post.author_name?.charAt(0) || "A"}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">
              {post.author_name || "Admin"}
            </h3>
            <p className="text-sm text-slate-500">Health & Wellness Writer</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✍️ Author
              </span>
              <span className="text-xs text-slate-400">
                Published: {formatDateEn(post.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-500" />
            Related Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                {blog.image && (
                  <div className="relative w-full h-40 bg-slate-100">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {blog.author_name || "Admin"} • {blog.read_time || "5"} min
                    read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Enjoyed this article?
            </h3>
            <p className="text-sm text-slate-500">
              Explore more health tips and wellness guides
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-105 active:scale-95"
          >
            All Articles
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
