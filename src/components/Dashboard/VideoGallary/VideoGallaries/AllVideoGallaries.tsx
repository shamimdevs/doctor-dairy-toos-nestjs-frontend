"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2, Video } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";
import {
  useDeleteVideoGallaryMutation,
  useGetAllVideoGallariesQuery,
} from "@/src/redux/api/videoGallaryApi";
import { VideoGallaryItem } from "@/src/types/videoGallaryType";

const LIMIT = 10;

const AllVideoGallaries: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } = useGetAllVideoGallariesQuery(
    {
      search: (debouncedSearch as string) || undefined,
      page: currentPage,
      limit: LIMIT,
    },
  );

  const [deleteVideoGallary] = useDeleteVideoGallaryMutation();

  const videoGallaries: VideoGallaryItem[] = data?.data || [];

  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search input
  };

  const handleDeleteVideoGallary = async (item: VideoGallaryItem) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete video gallery "${item.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deleteVideoGallary(item.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Video gallery "${item.title}" has been deleted.`,
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
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Video Galleries
          </h1>
          <p className="text-sm text-gray-500">
            Manage all promotional and gallery videos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/video-gallaries/add-video-gallaries">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition w-full sm:w-auto">
              <Plus size={18} />
              Add Video
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Thumbnail
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Title
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Video URL
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Added By
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className={isFetching ? "opacity-50 pointer-events-none" : ""}>
            {videoGallaries.length > 0 ? (
              videoGallaries.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 text-sm py-2">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-2">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>

                  <td
                    className="px-5 py-2 text-sm font-medium text-gray-800 max-w-50 truncate"
                    title={item.title}
                  >
                    {item.title}
                  </td>

                  <td className="px-5 py-2 text-sm text-gray-600">
                    {item.videoGallaryCategory?.title || "N/A"}
                  </td>

                  <td className="px-5 py-2 text-sm text-blue-600">
                    {item.video_url ? (
                      <a
                        href={item.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <Video size={14} /> View Video
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="px-5 py-2 text-sm text-gray-600">
                    {item.addedBy?.name || item.addedBy?.email || "N/A"}
                  </td>

                  <td className="px-5 py-2 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (item.is_active ?? true)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(item.is_active ?? true) ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-2">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/video-gallaries/edit-video-gallaries/${item.id}`}
                      >
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteVideoGallary(item)}
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
                  No video galleries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {videoGallaries.length > 0 && (
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

export default AllVideoGallaries;
