import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { getBlogs } from "../services/blogService";

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

const LATEST_BLOGS_LIMIT = 3;

const HomeBlogSection = async () => {
  const { data: blogs } = await getBlogs({
    page: 1,
    limit: LATEST_BLOGS_LIMIT,
  });

  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase text-[#059669] bg-indigo-50 rounded-full mb-4">
            আমাদের ব্লগ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            সর্বশেষ আর্টিকেল
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            আপনাকে আপডেট রাখতে ব্যবহারিক গাইড, শিল্প সংবাদ ও স্বাস্থ্য পরামর্শ।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              catColor={catColor}
              authorAvatar={authorAvatar}
              formatDate={formatDate}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#059669] text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
          >
            আরও দেখুন
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
