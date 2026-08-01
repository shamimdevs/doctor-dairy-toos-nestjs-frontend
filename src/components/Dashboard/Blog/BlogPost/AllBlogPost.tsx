"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { BlogItem } from "@/src/types/blogType";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";

const LIMIT = 10;

const AllBlogPost: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } = useGetAllBlogsQuery({
    search: (debouncedSearch as string) || undefined,
    page: currentPage,
    limit: LIMIT,
  });

  const [deleteBlog] = useDeleteBlogMutation();

  const blogs: BlogItem[] = data?.data || [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleDeleteBlog = async (blog: BlogItem) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete blog post "${blog.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deleteBlog(blog.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Blog "${blog.title}" has been deleted.`,
        timer: 1000,
        showConfirmButton: false,
      });

      refetch();
    } catch (err) {
      const apiError = err as ApiError;

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: apiError.data?.message || apiError.message || "Delete failed",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        {[...Array(LIMIT)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse rounded-md bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500">Manage all blog articles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/blog/add-blog">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition">
              <Plus size={18} />
              Add Blog
            </button>
          </Link>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Author
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Featured
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {blogs?.length > 0 ? (
              blogs.map((blog, index) => (
                <tr
                  key={blog.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-sm">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-3">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={56}
                        height={56}
                        className="h-10 w-10 rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">
                    {blog.title}
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600">
                    {blog.author_name || "N/A"}
                  </td>

                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.is_featured
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {blog.is_featured ? "Featured" : "Regular"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.status
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {blog.status ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <Link href={`/dashboard/blog/edit-blog/${blog.id}`}>
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteBlog(blog)}
                        className="rounded-lg p-2 cursor-pointer text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {blogs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={totalItems}
          limit={LIMIT}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

export default AllBlogPost;
