"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Eye,
} from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  titleBn: string;
  category: string;
  image: string;
  price: number;
  discountPrice?: number;
  slug: string;
}

export default function GallerySection() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryItems: GalleryItem[] = [
    // Veterinary Surgical Items
    {
      id: 1,
      title: "Surgical Scalpel Blade Set",
      titleBn: "সার্জিক্যাল স্ক্যাল্পেল ব্লেড সেট",
      category: "veterinary-surgical",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      price: 450,
      discountPrice: 380,
      slug: "surgical-scalpel-blade-set",
    },
    {
      id: 2,
      title: "Veterinary Suture Needle Set",
      titleBn: "ভেটেরিনারি সিউচার সুই সেট",
      category: "veterinary-surgical",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      price: 650,
      discountPrice: 550,
      slug: "veterinary-suture-needle-set",
    },
    {
      id: 3,
      title: "Hemostat Forceps",
      titleBn: "হেমোস্ট্যাট ফোর্সেপস",
      category: "veterinary-surgical",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      price: 1200,
      discountPrice: 990,
      slug: "hemostat-forceps",
    },

    // Artificial Insemination Supplies
    {
      id: 4,
      title: "AI Gun",
      titleBn: "কৃত্রিম প্রজনন বন্দুক",
      category: "ai-supplies",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
      price: 2800,
      discountPrice: 2400,
      slug: "ai-gun",
    },
    {
      id: 5,
      title: "Semen Straw Set",
      titleBn: "সিমেন স্ট্র সেট",
      category: "ai-supplies",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      price: 350,
      discountPrice: 290,
      slug: "semen-straw-set",
    },
    {
      id: 6,
      title: "AI Gloves Pack",
      titleBn: "এআই গ্লাভস প্যাক",
      category: "ai-supplies",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      price: 250,
      discountPrice: 210,
      slug: "ai-gloves-pack",
    },

    // Dairy Farm Tools
    {
      id: 7,
      title: "Milk Measurement Meter",
      titleBn: "দুধ মাপার মিটার",
      category: "dairy-tools",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      price: 950,
      discountPrice: 820,
      slug: "milk-measurement-meter",
    },
    {
      id: 8,
      title: "Milk Filtering Kit",
      titleBn: "দুধ ফিল্টারিং কিট",
      category: "dairy-tools",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      price: 650,
      discountPrice: 560,
      slug: "milk-filtering-kit",
    },
    {
      id: 9,
      title: "Udder Cleaning Brush",
      titleBn: "স্তন পরিষ্কার ব্রাশ",
      category: "dairy-tools",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
      price: 380,
      discountPrice: 320,
      slug: "udder-cleaning-brush",
    },

    // Dairy Machinery
    {
      id: 10,
      title: "Automatic Milking Machine",
      titleBn: "অটোমেটিক মিল্কিং মেশিন",
      category: "dairy-machinery",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      price: 12000,
      discountPrice: 10500,
      slug: "automatic-milking-machine",
    },
    {
      id: 11,
      title: "Milk Pasteurizer Machine",
      titleBn: "দুধ পাস্তুরাইজার মেশিন",
      category: "dairy-machinery",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      price: 8500,
      discountPrice: 7400,
      slug: "milk-pasteurizer-machine",
    },
    {
      id: 12,
      title: "Cream Separator Machine",
      titleBn: "ক্রিম সিপারেটর মেশিন",
      category: "dairy-machinery",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      price: 6200,
      discountPrice: 5400,
      slug: "cream-separator-machine",
    },

    // Poultry Farm Tools
    {
      id: 13,
      title: "Poultry Feed Dispenser",
      titleBn: "পোল্ট্রি ফিড ডিসপেনসার",
      category: "poultry-tools",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      price: 550,
      discountPrice: 470,
      slug: "poultry-feed-dispenser",
    },
    {
      id: 14,
      title: "Poultry Water Nipple System",
      titleBn: "পোল্ট্রি ওয়াটার নিপল সিস্টেম",
      category: "poultry-tools",
      image:
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=800&auto=format&fit=crop",
      price: 850,
      discountPrice: 730,
      slug: "poultry-water-nipple-system",
    },
    {
      id: 15,
      title: "Egg Collection Brush",
      titleBn: "ডিম সংগ্রহ ব্রাশ",
      category: "poultry-tools",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
      price: 280,
      discountPrice: 240,
      slug: "egg-collection-brush",
    },

    // Veterinary Lab Items
    {
      id: 16,
      title: "Veterinary Microscope",
      titleBn: "ভেটেরিনারি মাইক্রোস্কোপ",
      category: "veterinary-lab",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      price: 4500,
      discountPrice: 3900,
      slug: "veterinary-microscope",
    },
    {
      id: 17,
      title: "Blood Test Kit",
      titleBn: "রক্ত পরীক্ষার কিট",
      category: "veterinary-lab",
      image:
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      price: 850,
      discountPrice: 740,
      slug: "blood-test-kit",
    },
    {
      id: 18,
      title: "Lab Test Tube Set",
      titleBn: "ল্যাব টেস্ট টিউব সেট",
      category: "veterinary-lab",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop",
      price: 380,
      discountPrice: 330,
      slug: "lab-test-tube-set",
    },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "veterinary-surgical", label: "Veterinary Surgical" },
    { id: "ai-supplies", label: "AI Supplies" },
    { id: "dairy-tools", label: "Dairy Tools" },
    { id: "dairy-machinery", label: "Dairy Machinery" },
    { id: "poultry-tools", label: "Poultry Tools" },
    { id: "veterinary-lab", label: "Veterinary Lab" },
  ];

  const filteredItems = galleryItems.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleBn.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < filteredItems.length) {
      setCurrentIndex(newIndex);
      setSelectedImage(filteredItems[newIndex]);
    }
  };

  return (
    <section className="container py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2">
          Our Product Gallery
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Browse through our extensive collection of veterinary and farm
          products
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
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

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(item, index)}
            >
              {/* Image */}
              <div className="relative h-48 md:h-64 overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {item.discountPrice && item.discountPrice < item.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {Math.round(
                      ((item.price - item.discountPrice) / item.price) * 100,
                    )}
                    % OFF
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <Eye className="w-5 h-5 text-slate-700" />
                    </button>
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <ShoppingBag className="w-5 h-5 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 md:p-4">
                <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mb-1">{item.titleBn}</p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold text-sm">
                    ৳{item.discountPrice || item.price}
                  </span>
                  {item.discountPrice && (
                    <span className="text-slate-400 line-through text-xs">
                      ৳{item.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
              className="absolute left-4 text-white hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {currentIndex < filteredItems.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
              className="absolute right-4 text-white hover:text-slate-300 transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-[90vw] max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.image}
              alt={selectedImage.title}
              fill
              className="object-contain"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-sm opacity-80">{selectedImage.titleBn}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-emerald-400 font-bold text-lg">
                  ৳{selectedImage.discountPrice || selectedImage.price}
                </span>
                {selectedImage.discountPrice && (
                  <span className="text-slate-400 line-through">
                    ৳{selectedImage.price}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/product/${selectedImage.slug}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  View Details
                </Link>
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </section>
  );
}
