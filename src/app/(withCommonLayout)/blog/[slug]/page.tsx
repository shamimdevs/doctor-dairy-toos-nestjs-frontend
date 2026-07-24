/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogDetails from "@/src/components/BlogSection/BlogDetails";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

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
  titles?: string[];
  bullets?: Array<{ title: string; text: string }>;
  position: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch blog post by slug from API
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/blog/slug/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.log(`Blog post not found: ${slug}`);
      return null;
    }

    const data = await res.json();

    return data?.data || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Fetch blog sections by blog ID
async function getBlogSections(blogId: string): Promise<BlogSection[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/blog-details/by-blog/${blogId}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.log(`Blog sections not found for blog: ${blogId}`);
      return [];
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching blog sections:", error);
    return [];
  }
}

// Fetch related blogs by category
async function getRelatedBlogs(categoryId: string, currentSlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const params = new URLSearchParams({
      limit: "6",
      status: "true",
      page: "1",
    });
    if (categoryId) params.set("category_id", categoryId);

    const res = await fetch(`${baseUrl}/blog?${params}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.log(`Related blogs not found`);
      return [];
    }

    const data = await res.json();

    const blogs = Array.isArray(data?.data) ? data.data : [];

    return blogs.filter((blog: any) => blog.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.content?.substring(0, 160) || "",
    openGraph: {
      title: post.meta_title || post.title,
      description:
        post.meta_description || post.content?.substring(0, 160) || "",
      images: post.image ? [post.image] : [],
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name || "Admin"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description:
        post.meta_description || post.content?.substring(0, 160) || "",
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  //  Await params in Next.js 15
  const { slug } = await params;

  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Fetch blog sections and related blogs in parallel
  const [sections, related] = await Promise.all([
    getBlogSections(post.id),
    getRelatedBlogs(post.category_id, slug),
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-indigo-50/20">
      <BlogDetails post={post} sections={sections} related={related} />
    </div>
  );
}

// Generate static paths at build time (optional)
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/blog?limit=100`);
    const data = await res.json();
    const posts = data?.data?.data || data?.data || [];

    return posts
      .filter((p: any) => p.slug)
      .map((post: any) => ({
        slug: post.slug,
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
