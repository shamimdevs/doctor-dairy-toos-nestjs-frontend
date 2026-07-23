// src/services/blogService.ts

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://your-api-domain.com/api";

export interface IBlogCategory {
  id: string;
  category_name: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface IBlog {
  id: string;
  title: string;
  slug: string;
  author_name: string;
  image: string | null;
  excerpt: string | null;
  content: string;
  read_time: string;
  tags: string[] | null;
  position: number;
  is_featured: boolean;
  status: boolean;
  category_id: string;
  category?: IBlogCategory;
  added_by: string;
  created_at: string;
  updated_at: string;
}

export interface IBlogMeta {
  has_more: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface IBlogResponse {
  data: IBlog[];
  meta: IBlogMeta;
}

// Fetch all categories
export async function getBlogCategories(): Promise<IBlogCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/blog-category?limit=100`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();

    return json?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch Paginated Blogs (for infinite scroll)
export async function getBlogs({
  page = 1,
  limit = 6,
  categoryId = "all",
}: {
  page?: number;
  limit?: number;
  categoryId?: string;
}): Promise<IBlogResponse> {
  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status: "true",
    });

    if (categoryId && categoryId !== "all") {
      query.append("category_id", categoryId);
    }

    const res = await fetch(
      `${API_BASE}/blog/infinite-scroll?${query.toString()}`,
      {
        next: { revalidate: 30 },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch blogs");
    const json = await res.json();

    const responseData = json?.data || { meta: {}, data: [] };

    return {
      data: responseData.data || [],
      meta: {
        has_more: responseData.meta?.page < responseData.meta?.totalPages,
        total: responseData.meta?.total || 0,
        page: responseData.meta?.page || page,
        limit: responseData.meta?.limit || limit,
        totalPages: responseData.meta?.totalPages || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      data: [],
      meta: { has_more: false, total: 0, page, limit, totalPages: 0 },
    };
  }
}

// Fetch Single Blog by Slug
export async function getBlogBySlug(slug: string): Promise<IBlog | null> {
  try {
    // Note: In your controller, the slug endpoint is '/slug/:slug'
    const res = await fetch(`${API_BASE}/blog/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return null;
  }
}

// Alternative: Fetch single blog by ID
export async function getBlogById(id: string): Promise<IBlog | null> {
  try {
    const res = await fetch(`${API_BASE}/blog/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching single blog by ID:", error);
    return null;
  }
}
