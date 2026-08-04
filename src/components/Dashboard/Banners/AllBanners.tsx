"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import { useDebounce } from "@/src/hooks/useDebounce";
import { BannerItem, BannerType } from "@/src/types/bannerType";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";
import {
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
} from "@/src/redux/api/bannerApi";

const LIMIT = 10;

type TypeFilter = BannerType | "all";

const TYPE_TABS: { label: string; value: TypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Hero Slider", value: "hero_slider" },
  { label: "Hero Side Card", value: "hero_side" },
];

const TYPE_BADGE_STYLE: Record<BannerType, string> = {
  hero_slider: "bg-blue-50 text-blue-700 border-blue-200",
  hero_side: "bg-purple-50 text-purple-700 border-purple-200",
};

const TYPE_LABEL: Record<BannerType, string> = {
  hero_slider: "Hero Slider",
  hero_side: "Hero Side Card",
};

const AllBanners: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } = useGetAllBannersQuery({
    search: (debouncedSearch as string) || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
    page: currentPage,
    limit: LIMIT,
  });

  const [deleteBanner] = useDeleteBannerMutation();
  const [updateBanner, { isLoading: isToggling }] = useUpdateBannerMutation();

  const banners: BannerItem[] = data?.data || [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: TypeFilter) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      await updateBanner({
        id: banner.id,
        data: { is_active: !banner.is_active },
      }).unwrap();
      toast.success(
        banner.is_active
          ? `"${banner.title}" deactivated`
          : `"${banner.title}" activated`,
      );
    } catch (err) {
      const apiError = err as ApiError;
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          apiError.data?.message ||
          apiError.message ||
          "Failed to update banner status",
      });
    }
  };

  const handleDeleteBanner = async (banner: BannerItem) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete banner "${banner.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deleteBanner(banner.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Banner "${banner.title}" has been deleted.`,
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
          <h1 className="text-2xl font-semibold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500">
            Manage the homepage hero slider and side cards
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search banners..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/banners/add-banners">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition w-full sm:w-auto">
              <Plus size={18} />
              Add Banner
            </button>
          </Link>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 px-6 pt-4 border-b border-gray-200">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTypeFilterChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition cursor-pointer ${
              typeFilter === tab.value
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
                Placement
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Position
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Redirect
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {banners?.length > 0 ? (
              banners.map((banner, index) => (
                <tr
                  key={banner.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-sm">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-3">
                    <div className="relative h-12 w-20 overflow-hidden rounded-md border bg-gray-50">
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>

                  <td className="px-5 py-3 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                    {banner.title}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${TYPE_BADGE_STYLE[banner.type]}`}
                    >
                      {TYPE_LABEL[banner.type]}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-center text-sm text-gray-600">
                    {banner.position}
                  </td>

                  <td className="px-5 py-3 text-sm">
                    {banner.redirect_url ? (
                      <a
                        href={banner.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:underline max-w-[160px] truncate"
                      >
                        <ExternalLink size={12} />
                        <span className="truncate">
                          {banner.redirect_url}
                        </span>
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      disabled={isToggling}
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition disabled:opacity-60 ${
                        banner.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}
                      title="Click to toggle status"
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/banners/edit-banners/${banner.id}`}
                      >
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteBanner(banner)}
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
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {banners.length > 0 && (
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

export default AllBanners;
