/* eslint-disable @typescript-eslint/no-explicit-any */
import HomeBlogSection from "@/src/components/BlogSection/HomeBlogSection";
import FAQSection from "@/src/components/FAQSection/FAQSection";
import CategorySection from "@/src/components/HomePage/CategorySection/CategorySection";
// import FeaturesSection from "@/src/components/HomePage/HeroSection/FeaturesSection";
import HeroSection from "@/src/components/HomePage/HeroSection/HeroSection";
import ProductShowcase from "@/src/components/HomePage/ProductShowcase/ProductShowcase";
import TestimonialSection from "@/src/components/TestimonialSection/TestimonialSection";
import HomeVideoSection from "@/src/components/VideoGallery/HomeVideoSection";
import {
  getVideos,
  IVideoGallary,
} from "@/src/components/services/videoService";
import { ProductCategory } from "@/src/types/productCategoriesType";

interface ICategoriesApiResponse {
  apiVersion: string;
  success: boolean;
  message: string;
  status: number;
  data: ProductCategory[];
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

export interface IBannerItem {
  id: string;
  title: string;
  image_url: string;
  redirect_url?: string;
}

interface IBannersApiResponse {
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
  data: IBannerItem[];
}

async function fetchCategories(baseUrl: string) {
  // limit=100 so every category (ordered by its configured position) is
  // available to ProductShowcase, not just the paginated default of 10.
  const res = await fetch(`${baseUrl}/product-categories?limit=100`, {
    next: { revalidate: 100 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result: ICategoriesApiResponse = await res.json();
  return result.data || [];
}

async function fetchProducts(baseUrl: string) {
  const res = await fetch(`${baseUrl}/products?limit=300`, {
    next: { revalidate: 20 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const result: IProductsApiResponse = await res.json();
  return result?.data || [];
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

async function fetchSliderBanners(baseUrl: string) {
  const res = await fetch(
    `${baseUrl}/banners?type=hero_slider&is_active=true`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch slider banners");
  }

  const result: IBannersApiResponse = await res.json();
  return result.data || [];
}

async function fetchSideBanners(baseUrl: string) {
  const res = await fetch(
    `${baseUrl}/banners?type=hero_side&is_active=true&limit=2`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch side banners");
  }

  const result: IBannersApiResponse = await res.json();
  return result.data || [];
}

const Page = async () => {
  let categories: ProductCategory[] = [];
  let products: any[] = [];
  let videos: IVideoGallary[] = [];

  let testimonials: ITestimonial[] = [];
  let questionAnswers: IFAQItem[] = [];
  let sliderBanners: IBannerItem[] = [];
  let sideBanners: IBannerItem[] = [];

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

  try {
    videos = await getVideos(4);
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

  try {
    sliderBanners = await fetchSliderBanners(baseUrl);
  } catch (error) {
    console.error("Failed to fetch slider banners:", error);
    sliderBanners = [];
  }

  try {
    sideBanners = await fetchSideBanners(baseUrl);
  } catch (error) {
    console.error("Failed to fetch side banners:", error);
    sideBanners = [];
  }

  return (
    <>
      <HeroSection sliderBanners={sliderBanners} sideBanners={sideBanners} />
      {/* <FeaturesSection /> */}
      <CategorySection categories={categories} />
      <ProductShowcase products={products} categories={categories} />
      <HomeVideoSection videos={videos} />
      <HomeBlogSection />
      <TestimonialSection testimonials={testimonials} />
      <FAQSection faqs={questionAnswers} />
    </>
  );
};

export default Page;
