/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useInfiniteProducts.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

interface Props {
  baseUrl: string;
  limit?: number;
  search?: string;
  category?: string;
}

interface ProductsResponse {
  meta: {
    page: number;
    totalPages: number;
    total: number;
  };
  data: any[];
}

export const useInfiniteProducts = ({
  baseUrl,
  limit = 20,
  search = "",
  category = "",
}: Props) => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset when search/category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [search, category]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append("search", search);
        if (category) params.append("category", category);

        const res = await fetch(`${baseUrl}/products?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result: ProductsResponse = await res.json();

        setTotal(result.meta.total);

        setProducts((prev) =>
          page === 1 ? result.data : [...prev, ...result.data],
        );

        setHasMore(page < result.meta.totalPages);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [page, search, category, limit, baseUrl]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    products,
    total,
    loading,
    error,
    hasMore,
    page,
    loadMore,
  };
};
