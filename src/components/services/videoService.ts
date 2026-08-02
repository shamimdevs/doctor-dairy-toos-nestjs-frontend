// src/services/videoService.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface IVideoGallaryCategory {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IVideoGallary {
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

// Fetch video gallery categories
export async function getVideoCategories(): Promise<IVideoGallaryCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/video-gallary-categories`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("Failed to fetch video categories");
    const json = await res.json();

    return json?.data || [];
  } catch (error) {
    console.error("Error fetching video categories:", error);
    return [];
  }
}

// Fetch videos, optionally limited (e.g. for a homepage teaser)
export async function getVideos(limit?: number): Promise<IVideoGallary[]> {
  try {
    const query = limit ? `?limit=${limit}` : "";
    const res = await fetch(`${API_BASE}/video-gallaries${query}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("Failed to fetch videos");
    const json = await res.json();

    return json?.data || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}
