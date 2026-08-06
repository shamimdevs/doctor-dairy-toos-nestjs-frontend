"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { Purchase, PurchaseStatus } from "@/src/types/purchaseType";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";
import {
  useDeletePurchaseMutation,
  useGetAllPurchasesQuery,
} from "@/src/redux/api/purchaseApi";

const LIMIT = 10;

type StatusFilter = PurchaseStatus | "all";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Received", value: "received" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_BADGE_STYLE: Record<PurchaseStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  received: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const AllPurchases: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } = useGetAllPurchasesQuery({
    search: (debouncedSearch as string) || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage,
    limit: LIMIT,
  });

  const [deletePurchase] = useDeletePurchaseMutation();

  const purchases: Purchase[] = data?.data || [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDeletePurchase = async (purchase: Purchase) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete purchase of "${purchase.product_name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deletePurchase(purchase.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Purchase of "${purchase.product_name}" has been deleted.`,
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
          <h1 className="text-2xl font-semibold text-gray-900">Purchases</h1>
          <p className="text-sm text-gray-500">
            Track stock purchased from suppliers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by product or supplier..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/purchases/add-purchase">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition w-full sm:w-auto">
              <Plus size={18} />
              Add Purchase
            </button>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 px-6 pt-4 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleStatusFilterChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition cursor-pointer ${
              statusFilter === tab.value
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
                Product Name
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">
                Total Amount
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Supplier
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Purchase Date
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
            {purchases?.length > 0 ? (
              purchases.map((purchase, index) => (
                <tr
                  key={purchase.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-sm">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-gray-50 flex items-center justify-center">
                      {purchase.image ? (
                        <Image
                          src={purchase.image}
                          alt={purchase.product_name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Package size={18} className="text-gray-300" />
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                    {purchase.product_name}
                  </td>

                  <td className="px-5 py-3 text-center text-sm text-gray-600">
                    {purchase.quantity}
                  </td>

                  <td className="px-5 py-3 text-right text-sm text-gray-800">
                    {Number(purchase.total_amount).toFixed(2)}
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                    {purchase.supplier_name}
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600">
                    {purchase.purchase_date?.slice(0, 10)}
                  </td>

                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_BADGE_STYLE[purchase.status]}`}
                    >
                      {purchase.status.charAt(0).toUpperCase() +
                        purchase.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/purchases/edit-purchase/${purchase.id}`}
                      >
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeletePurchase(purchase)}
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
                <td colSpan={9} className="py-10 text-center text-gray-500">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {purchases.length > 0 && (
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

export default AllPurchases;
