"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Heart,
} from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  titleBn: string;
  excerpt: string;
  excerptBn: string;
  content: string;
  category: string;
  categoryBn: string;
  image: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  tags: string[];
  featured: boolean;
}

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Modern Dairy Farming: Best Practices for Maximum Milk Production",
      titleBn: "আধুনিক ডেইরি ফার্মিং: সর্বোচ্চ দুধ উৎপাদনের সেরা অনুশীলন",
      excerpt:
        "Discover the latest techniques and technologies in modern dairy farming that can help you increase milk production while maintaining animal health and welfare.",
      excerptBn:
        "আধুনিক ডেইরি ফার্মিংয়ের সর্বশেষ কৌশল এবং প্রযুক্তি আবিষ্কার করুন যা পশু স্বাস্থ্য ও কল্যাণ বজায় রেখে দুধ উৎপাদন বাড়াতে সহায়তা করতে পারে।",
      content: "Full content here...",
      category: "dairy-farming",
      categoryBn: "ডেইরি ফার্মিং",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Md. Rahman",
      authorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-15",
      readTime: "8 min read",
      views: 2540,
      comments: 45,
      tags: ["Dairy", "Farming", "Milk Production"],
      featured: true,
    },
    {
      id: 2,
      title: "Essential Poultry Farm Equipment Every Farmer Should Have",
      titleBn: "প্রত্যেক কৃষকের থাকা উচিত প্রয়োজনীয় পোল্ট্রি ফার্ম সরঞ্জাম",
      excerpt:
        "A comprehensive guide to essential poultry farm equipment, from feeding systems to climate control, that ensures optimal bird health and productivity.",
      excerptBn:
        "খাদ্য সরবরাহ ব্যবস্থা থেকে শুরু করে জলবায়ু নিয়ন্ত্রণ পর্যন্ত প্রয়োজনীয় পোল্ট্রি ফার্ম সরঞ্জামগুলির একটি বিস্তৃত গাইড যা পাখির স্বাস্থ্য এবং উৎপাদনশীলতা নিশ্চিত করে।",
      content: "Full content here...",
      category: "poultry-farming",
      categoryBn: "পোল্ট্রি ফার্মিং",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Sultana Begum",
      authorImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-12",
      readTime: "6 min read",
      views: 1870,
      comments: 32,
      tags: ["Poultry", "Equipment", "Farming"],
      featured: false,
    },
    {
      id: 3,
      title: "Complete Guide to Artificial Insemination in Cattle",
      titleBn: "গবাদি পশুতে কৃত্রিম প্রজননের সম্পূর্ণ গাইড",
      excerpt:
        "Learn everything about artificial insemination in cattle, from proper techniques to equipment maintenance, for successful breeding programs.",
      excerptBn:
        "সফল প্রজনন কর্মসূচির জন্য সঠিক কৌশল থেকে সরঞ্জাম রক্ষণাবেক্ষণ পর্যন্ত গবাদি পশুতে কৃত্রিম প্রজনন সম্পর্কে সবকিছু জানুন।",
      content: "Full content here...",
      category: "ai-breeding",
      categoryBn: "কৃত্রিম প্রজনন",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Kamal Hossain",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-10",
      readTime: "10 min read",
      views: 3200,
      comments: 67,
      tags: ["AI", "Breeding", "Cattle"],
      featured: true,
    },
    {
      id: 4,
      title:
        "Understanding Veterinary Lab Diagnostics for Better Animal Health",
      titleBn: "উন্নত পশু স্বাস্থ্যের জন্য ভেটেরিনারি ল্যাব ডায়াগনস্টিকস বোঝা",
      excerpt:
        "An in-depth look at veterinary laboratory diagnostics and how they help in early disease detection and treatment planning for animals.",
      excerptBn:
        "ভেটেরিনারি ল্যাবরেটরি ডায়াগনস্টিকস এবং কীভাবে তারা প্রাণীদের প্রাথমিক রোগ সনাক্তকরণ এবং চিকিত্সা পরিকল্পনায় সহায়তা করে তার একটি গভীরভাবে দৃষ্টিপাত।",
      content: "Full content here...",
      category: "veterinary-lab",
      categoryBn: "ভেটেরিনারি ল্যাব",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Nasrin Akter",
      authorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-08",
      readTime: "7 min read",
      views: 1560,
      comments: 28,
      tags: ["Lab", "Diagnostics", "Health"],
      featured: false,
    },
    {
      id: 5,
      title: "Modern Veterinary Surgical Techniques and Instruments",
      titleBn: "আধুনিক ভেটেরিনারি সার্জিক্যাল টেকনিক ও যন্ত্রপাতি",
      excerpt:
        "Explore the latest advancements in veterinary surgical techniques and the essential instruments needed for successful animal surgeries.",
      excerptBn:
        "ভেটেরিনারি সার্জিক্যাল টেকনিকের সর্বশেষ অগ্রগতি এবং সফল পশু অস্ত্রোপচারের জন্য প্রয়োজনীয় প্রয়োজনীয় যন্ত্রগুলি অন্বেষণ করুন।",
      content: "Full content here...",
      category: "veterinary-surgery",
      categoryBn: "ভেটেরিনারি সার্জারি",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Ashraf Uddin",
      authorImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-06",
      readTime: "9 min read",
      views: 2100,
      comments: 41,
      tags: ["Surgery", "Veterinary", "Instruments"],
      featured: false,
    },
    {
      id: 6,
      title: "Effective Animal Nutrition: Feed Management Guide",
      titleBn: "কার্যকর পশু পুষ্টি: ফিড ম্যানেজমেন্ট গাইড",
      excerpt:
        "Learn how to optimize animal nutrition with proper feed management, including feed types, storage, and feeding schedules for different animals.",
      excerptBn:
        "বিভিন্ন প্রাণীর জন্য ফিডের প্রকার, স্টোরেজ এবং খাওয়ানোর সময়সূচী সহ সঠিক ফিড ব্যবস্থাপনার মাধ্যমে কীভাবে পশুর পুষ্টি অনুকূল করা যায় তা শিখুন।",
      content: "Full content here...",
      category: "animal-nutrition",
      categoryBn: "পশু পুষ্টি",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Farhana Islam",
      authorImage:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-04",
      readTime: "8 min read",
      views: 1780,
      comments: 34,
      tags: ["Nutrition", "Feed", "Management"],
      featured: false,
    },
    {
      id: 7,
      title: "Biosecurity Measures for Modern Farms",
      titleBn: "আধুনিক খামারের জন্য বায়োসিকিউরিটি ব্যবস্থা",
      excerpt:
        "Essential biosecurity practices to protect your farm from disease outbreaks and ensure the health and safety of your animals.",
      excerptBn:
        "আপনার খামারকে রোগের প্রাদুর্ভাব থেকে রক্ষা করতে এবং আপনার পশুর স্বাস্থ্য ও নিরাপত্তা নিশ্চিত করার জন্য প্রয়োজনীয় বায়োসিকিউরিটি অনুশীলন।",
      content: "Full content here...",
      category: "farm-management",
      categoryBn: "খামার ব্যবস্থাপনা",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Mahmud Hasan",
      authorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-02",
      readTime: "6 min read",
      views: 2340,
      comments: 53,
      tags: ["Biosecurity", "Health", "Safety"],
      featured: false,
    },
    {
      id: 8,
      title: "Dairy Farm Machinery: Investment Guide",
      titleBn: "ডেইরি ফার্ম মেশিনারি: বিনিয়োগ গাইড",
      excerpt:
        "A comprehensive guide to investing in dairy farm machinery, including cost-benefit analysis and equipment selection tips.",
      excerptBn:
        "খরচ-সুবিধা বিশ্লেষণ এবং সরঞ্জাম নির্বাচন টিপস সহ ডেইরি ফার্ম যন্ত্রপাতিতে বিনিয়োগের একটি বিস্তৃত গাইড।",
      content: "Full content here...",
      category: "dairy-machinery",
      categoryBn: "ডেইরি মেশিনারি",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      author: "Dr. Rashed Khan",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      date: "2024-01-01",
      readTime: "10 min read",
      views: 1960,
      comments: 39,
      tags: ["Machinery", "Investment", "Dairy"],
      featured: false,
    },
  ];

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "dairy-farming", label: "Dairy Farming" },
    { id: "poultry-farming", label: "Poultry Farming" },
    { id: "ai-breeding", label: "AI Breeding" },
    { id: "veterinary-lab", label: "Veterinary Lab" },
    { id: "veterinary-surgery", label: "Veterinary Surgery" },
    { id: "animal-nutrition", label: "Animal Nutrition" },
    { id: "farm-management", label: "Farm Management" },
    { id: "dairy-machinery", label: "Dairy Machinery" },
  ];

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.titleBn.includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured);

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Bookmark className="w-4 h-4" />
          Our Blog
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
          Latest Veterinary & Farming Insights
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
          Expert articles, guides, and tips to improve your farm's productivity
          and animal health
        </p>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 md:h-72">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-600 text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </span>
                      <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                        {post.categoryBn}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap
                ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Blog Grid */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No posts found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {post.categoryBn}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/blog/${post.id}`}>
                  <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{post.titleBn}</p>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                </Link>

                {/* Author & Meta */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {post.author}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`
                w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300
                ${
                  currentPage === page
                    ? "bg-emerald-600 text-white shadow-md"
                    : "border border-slate-200 hover:border-emerald-500 text-slate-600"
                }
              `}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 hover:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-10 text-white text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          Subscribe to Our Newsletter
        </h3>
        <p className="text-emerald-100 text-sm md:text-base mb-4 max-w-lg mx-auto">
          Get the latest veterinary insights, farming tips, and product updates
          delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button className="bg-white text-emerald-700 font-semibold px-6 py-2 rounded-full hover:bg-emerald-50 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
