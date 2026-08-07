"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import { useDebounce } from "@/src/hooks/useDebounce";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useReorderProductsMutation,
} from "@/src/redux/api/productsApi";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";
import { Product } from "@/src/types/productsType";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";

const LIMIT = 10;

const AllProducts: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching, refetch } = useGetAllProductsQuery({
    search: (debouncedSearch as string) || undefined,
    category_id: categoryId || undefined,
    page: currentPage,
    limit: LIMIT,
  });

  const { data: categoriesData } = useGetAllProductCategoriesQuery({
    limit: 200,
  });
  const categories = categoriesData?.data || [];

  const [deleteProduct] = useDeleteProductMutation();
  const [reorderProducts, { isLoading: isReordering }] =
    useReorderProductsMutation();

  const products: Product[] = data?.data || [];

  // FIX: Updated `data?.meta?.totalPage` to `data?.meta?.totalPages`
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search input
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setCurrentPage(1); // Reset to page 1 on category change
  };

  // Swap with the adjacent row (within the current page) and renumber by
  // rank — a plain value swap would no-op whenever both rows still share the
  // default position (e.g. legacy products that predate this feature).
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= products.length) return;

    const reordered = [...products];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const basePosition = (currentPage - 1) * LIMIT;
    const items = reordered.map((product, i) => ({
      id: product.id,
      position: basePosition + i + 1,
    }));

    try {
      await reorderProducts({ items }).unwrap();

      refetch();
    } catch (err) {
      const apiError = err as ApiError;

      toast.error(
        apiError.data?.message || apiError.message || "Failed to reorder",
      );
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete product "${product.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      await deleteProduct(product.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Product "${product.name}" has been deleted.`,
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
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">
            Manage all products in your inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <select
            value={categoryId}
            onChange={handleCategoryChange}
            className="w-full sm:w-56 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <Link href="/dashboard/products/add-products">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition w-full sm:w-auto">
              <Plus size={18} />
              Add Product
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
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Position
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Discount Price
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Stock
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
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 text-sm py-2">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-2">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
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

                  <td className="px-5 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-600 w-6 text-center">
                        {product.position}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={isReordering || index === 0}
                          className="rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={isReordering || index === products.length - 1}
                          className="rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-2 text-sm font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="px-5 py-2 text-sm text-gray-600">
                    {product.category?.name || "N/A"}
                  </td>

                  <td className="px-5 py-2 text-sm text-gray-800 font-medium">
                    ৳{product.price}
                    {product.discount_price ? (
                      <span className="ml-2 text-xs text-red-500 line-through">
                        ৳{product.original_price}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-2 text-sm text-gray-800 font-medium">
                    ৳{product.discount_price}
                  </td>

                  <td className="px-5 py-2 text-sm text-gray-600">
                    {product.stock ?? 0}
                  </td>

                  <td className="px-5 py-2 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-2">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/products/edit-products/${product.id}`}
                      >
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(product)}
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
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {products.length > 0 && (
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

export default AllProducts;
