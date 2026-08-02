/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";

import { useDebounce } from "@/src/hooks/useDebounce";
import { ApiError } from "@/src/types/authType";
import { BlogDetail } from "@/src/types/blogDetailsType";
import Pagination from "@/src/utils/Pagination";
import {
  useDeleteTizaraBlogDetailMutation,
  useGetAllTizaraBlogDetailsQuery,
} from "@/src/redux/api/blogDetailsApi";

const LIMIT = 10;

interface BlogDetailGroup {
  blog_id: string;
  blog_title: string;
  sections: BlogDetail[];
}

const AllBlogDetails: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedBlogs, setExpandedBlogs] = useState<Record<string, boolean>>(
    {},
  );

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } =
    useGetAllTizaraBlogDetailsQuery({
      search: (debouncedSearch as string) || undefined,
      page: currentPage,
      limit: LIMIT,
    });

  const [deleteBlogDetail] = useDeleteTizaraBlogDetailMutation();

  const details: BlogDetail[] = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const totalItems = data?.data?.meta?.total ?? 0;

  // Group flat sections by their parent blog for a nested table view
  const groupedDetails = useMemo<BlogDetailGroup[]>(() => {
    const groups: Record<string, BlogDetailGroup> = {};

    details.forEach((item) => {
      const blogId = item.blog_id;
      if (!groups[blogId]) {
        groups[blogId] = {
          blog_id: blogId,
          blog_title: item.blog?.title || `Blog #${blogId}`,
          sections: [],
        };
      }
      groups[blogId].sections.push(item);
    });

    Object.values(groups).forEach((group) => {
      group.sections.sort((a, b) => (a.position || 0) - (b.position || 0));
    });

    return Object.values(groups);
  }, [details]);

  const toggleBlog = (blogId: string) => {
    setExpandedBlogs((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (item: BlogDetail) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete section "${item.heading || item.section_key || "Untitled"}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deleteBlogDetail(item.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Blog section has been deleted.",
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Blog Sections
          </h1>
          <p className="text-sm text-gray-500">
            Manage the detail sections shown on each blog post
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search sections..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/blog/blog-details/add-blog-details">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition">
              <Plus size={18} />
              Add Section
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
                Blog Title
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Sections
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Total
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {groupedDetails.length > 0 ? (
              groupedDetails.map((group, groupIndex) => {
                const isExpanded = expandedBlogs[group.blog_id] || false;
                const totalSections = group.sections.length;

                return (
                  <React.Fragment key={group.blog_id}>
                    {/* Parent blog row */}
                    <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-5 py-3 text-sm">
                        {(currentPage - 1) * LIMIT + groupIndex + 1}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-emerald-700">
                        {group.blog_title}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleBlog(group.blog_id)}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                          <span>
                            {isExpanded
                              ? "Hide sections"
                              : `Show ${totalSections} section${totalSections === 1 ? "" : "s"}`}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {totalSections}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link
                          href={`/dashboard/blog/blog-details/add-blog-details?blog_id=${group.blog_id}`}
                        >
                          <button className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition cursor-pointer">
                            Add Section
                          </button>
                        </Link>
                      </td>
                    </tr>

                    {/* Expanded child sections */}
                    {isExpanded &&
                      group.sections.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition"
                        >
                          <td className="px-5 py-3" />
                          <td className="px-5 py-3 pl-8 text-sm text-gray-500">
                            <span className="text-xs text-gray-400 mr-2">
                              &#8627;
                            </span>
                            <span className="font-mono text-xs text-emerald-700">
                              {item.section_key || "-"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-800">
                                {item.heading || "-"}
                              </span>
                              {item.body && (
                                <span className="text-xs text-gray-500 truncate max-w-md">
                                  {item.body
                                    .replace(/<[^>]*>/g, "")
                                    .slice(0, 60)}
                                  ...
                                </span>
                              )}
                              {Array.isArray(item.bullets) &&
                                item.bullets.length > 0 && (
                                  <span className="text-xs text-gray-400">
                                    {item.bullets.length} bullet
                                    {item.bullets.length > 1 ? "s" : ""}
                                  </span>
                                )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-center gap-2">
                              <Link
                                href={`/dashboard/blog/blog-details/edit-blog-details/${item.id}`}
                              >
                                <button
                                  className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                </button>
                              </Link>

                              <button
                                onClick={() => handleDelete(item)}
                                className="rounded-lg p-2 cursor-pointer text-red-600 hover:bg-red-100 transition"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No blog sections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {groupedDetails.length > 0 && (
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

export default AllBlogDetails;
