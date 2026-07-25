/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogSection from "@/src/components/BlogSection/BlogSection";
import FAQSection from "@/src/components/FAQSection/FAQSection";
import CategorySection from "@/src/components/HomePage/CategorySection/CategorySection";
import FeaturesSection from "@/src/components/HomePage/HeroSection/FeaturesSection";
import HeroSection from "@/src/components/HomePage/HeroSection/HeroSection";
import ProductShowcase from "@/src/components/HomePage/ProductShowcase/ProductShowcase";
import TestimonialSection from "@/src/components/TestimonialSection/TestimonialSection";
import VideoGallery from "@/src/components/VideoGallery/VideoGallery";
import { IProductCategory } from "@/src/types/productCategoriesType";

// Video API Response Types
interface IVideoGallary {
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

interface IVideoCategoriesResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: Array<{
    id: string;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

interface IVideoGallaryResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: IVideoGallary[];
}

interface ICategoriesApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: IProductCategory[];
}

interface IProductsApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: any[];
}

// Define API response types
interface ITestimonial {
  id: string;
  name: string;
  designation: string;
  image: string;
  description: string;
  rating: string;
  performance: number;
  created_at: string;
  updated_at: string;
}

interface ITestimonialResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: ITestimonial[];
}

// ⭐ Define IFAQItem interface BEFORE using it
interface IFAQItem {
  id: string;
  question: string;
  answer: string;
  questionBn?: string;
  answerBn?: string;
  category?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface IFetchQuestionAnswerss {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: IFAQItem[];
}

async function fetchCategories(baseUrl: string) {
  const res = await fetch(`${baseUrl}/product-categories`, {
    next: { revalidate: 100 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: ICategoriesApiResponse = await res.json();
  return result.data || [];
}

async function fetchProducts(baseUrl: string) {
  const res = await fetch(`${baseUrl}/products?limit=200`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const result: IProductsApiResponse = await res.json();
  return result?.data || [];
}

// NEW: Fetch video categories
async function fetchVideoCategories(baseUrl: string) {
  const res = await fetch(`${baseUrl}/video-gallary-categories`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch video categories");
  }

  const result: IVideoCategoriesResponse = await res.json();
  return result.data || [];
}

// NEW: Fetch videos
async function fetchVideos(baseUrl: string) {
  const res = await fetch(`${baseUrl}/video-gallaries`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }

  const result: IVideoGallaryResponse = await res.json();
  return result.data || [];
}

// Fetch function
async function fetchTestimonials(baseUrl: string) {
  const res = await fetch(`${baseUrl}/testimonials`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  const result: ITestimonialResponse = await res.json();
  return result.data || [];
}

// Fetch function
async function fetchQuestionAnswerss(baseUrl: string) {
  const res = await fetch(`${baseUrl}/question-answers`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch question-answers");
  }

  const result: IFetchQuestionAnswerss = await res.json();
  return result.data || [];
}

const Page = async () => {
  let categories: IProductCategory[] = [];
  let products: any[] = [];
  let videos: IVideoGallary[] = [];
  let videoCategories: any[] = [];

  let testimonials: ITestimonial[] = [];
  let questionAnswers: IFAQItem[] = [];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">API URL not configured</p>
      </div>
    );
  }

  try {
    categories = await fetchCategories(baseUrl);
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    categories = [];
  }

  try {
    products = await fetchProducts(baseUrl);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    products = [];
  }

  // NEW: Fetch video data
  try {
    videoCategories = await fetchVideoCategories(baseUrl);
  } catch (error) {
    console.error("Failed to fetch video categories:", error);
    videoCategories = [];
  }

  try {
    videos = await fetchVideos(baseUrl);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    videos = [];
  }

  try {
    testimonials = await fetchTestimonials(baseUrl);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    testimonials = [];
  }

  try {
    questionAnswers = await fetchQuestionAnswerss(baseUrl);
  } catch (error) {
    console.error("Failed to fetch questionAnswers:", error);
    questionAnswers = [];
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CategorySection categories={categories} />
      <ProductShowcase products={products} />
      <VideoGallery videos={videos} categories={videoCategories} />
      <BlogSection />
      <TestimonialSection testimonials={testimonials} />
      <FAQSection faqs={questionAnswers} />
    </>
  );
};

export default Page;
