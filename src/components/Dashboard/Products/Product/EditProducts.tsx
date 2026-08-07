/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import { ProductSpecification } from "@/src/types/productsType";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/src/redux/api/productsApi";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import WebEditor from "@/src/components/common/text-editor/WebEditor";
import ProductGalleryUploader from "./ProductGalleryUploader";

interface EditProductsProps {
  id: string;
}

interface EditProductFormValues {
  category_id: string;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  original_price?: number;
  stock?: number;
  weight?: number;
  thumbnail?: FileList;
  is_active: boolean;
  position?: number;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

// Supports English + Bangla
const generateSlug = (text: string) => {
  return text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/-+/g, "-");
};

// Helper function to safely convert any value to a valid number
const safeNumber = (val: any, fallback = 0): number => {
  const num = Number(val);
  return Number.isNaN(num) ? fallback : num;
};

const EditProducts: React.FC<EditProductsProps> = ({ id }) => {
  const router = useRouter();

  // Fetch product data and categories
  const { data: productData, isLoading: isFetchingProduct } =
    useGetSingleProductQuery(id);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllProductCategoriesQuery({ limit: 100 });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [description, setDescription] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    [],
  );
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");

  const handleAddSpecification = () => {
    if (!specLabel.trim() || !specValue.trim()) {
      toast.error("Both specification label and value are required.");
      return;
    }
    setSpecifications((prev) => [
      ...prev,
      { label: specLabel.trim(), value: specValue.trim() },
    ]);
    setSpecLabel("");
    setSpecValue("");
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProductFormValues>({
    defaultValues: {
      category_id: "",
      name: "",
      slug: "",
      price: 0,
      discount_price: 0,
      original_price: 0,
      stock: 0,
      weight: 0,
      is_active: true,
      meta_title: "",
      meta_keywords: "",
      meta_description: "",
    },
  });

  const nameValue = watch("name");
  const categoryIdValue = watch("category_id");
  const originalPriceValue = watch("original_price");
  const discountPriceValue = watch("discount_price");

  // Load existing product details into the form
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;

      const currentPrice = safeNumber(product.price);
      const discountPrice = safeNumber(product.discount_price);

      // Always calculate correct original_price fallback
      const originalPrice =
        product.original_price !== undefined && product.original_price !== null
          ? safeNumber(product.original_price)
          : currentPrice + discountPrice;

      reset({
        category_id: product.category_id || product.category?.id || "",
        name: product.name || "",
        slug: product.slug || "",
        price: currentPrice,
        discount_price: discountPrice,
        original_price: originalPrice,
        stock: safeNumber(product.stock),
        weight: safeNumber(product.weight),
        is_active: product.is_active ?? true,
        position: product.position ?? undefined,
        meta_title: product.meta_title || "",
        meta_keywords: product.meta_keywords || "",
        meta_description: product.meta_description || "",
      });

      if (product.thumbnail) {
        setThumbnailPreview(product.thumbnail);
      }

      setDescription(product.description || "");
      setSpecifications(product.specifications || []);
      setExistingImages(product.images || []);
    }
  }, [productData, reset]);

  // Handle auto slug creation on name change
  useEffect(() => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue));
    } else {
      setValue("slug", "");
    }
  }, [nameValue, setValue]);

  // Automatically calculate selling price: Price = Original Price - Discount Price
  useEffect(() => {
    const origPrice = safeNumber(originalPriceValue);
    const discPrice = safeNumber(discountPriceValue);
    const calculatedSellingPrice = Math.max(0, origPrice - discPrice);

    setValue("price", calculatedSellingPrice);
  }, [originalPriceValue, discountPriceValue, setValue]);

  // Handle Thumbnail File Preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Form Submit Handler
  const onSubmit: SubmitHandler<EditProductFormValues> = async (values) => {
    try {
      const formData = new FormData();

      const price = safeNumber(values.price);
      const discountPrice = safeNumber(values.discount_price);
      const stock = safeNumber(values.stock);
      const weight = safeNumber(values.weight);

      formData.append("category_id", values.category_id);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("price", String(price));
      formData.append("discount_price", String(discountPrice));
      formData.append("stock", String(stock));
      formData.append("weight", String(weight));
      formData.append("is_active", String(values.is_active));

      if (values.position !== undefined && !isNaN(values.position)) {
        formData.append("position", String(values.position));
      }

      if (values.meta_title) {
        formData.append("meta_title", values.meta_title);
      }

      if (values.meta_keywords) {
        formData.append("meta_keywords", values.meta_keywords);
      }

      if (values.meta_description) {
        formData.append("meta_description", values.meta_description);
      }
      if (description) {
        formData.append("description", description);
      }
      if (specifications.length > 0) {
        formData.append("specifications", JSON.stringify(specifications));
      }

      if (values.thumbnail?.[0]) {
        formData.append("thumbnail", values.thumbnail[0]);
      }
      galleryFiles.forEach((file) => formData.append("images", file));

      await updateProduct({
        id,
        data: formData,
      }).unwrap();

      toast.success("Product updated successfully!");
      router.push("/dashboard/products/all-products");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong.",
        icon: "error",
      });
    }
  };

  if (isFetchingProduct) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Edit Product"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Products",
            link: "/dashboard/products/all-products",
          },
          {
            title: "Edit Product",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <SelectAndSearch<EditProductFormValues>
            label="Category"
            options={categories}
            name="category_id"
            value={categoryIdValue}
            setValue={setValue}
            errors={errors}
            placeholder="Select category"
            required={true}
            disabled={isCategoriesLoading}
          />

          {/* Product Name */}
          <Input
            label="Product Name"
            text="name"
            register={register("name", {
              required: "Product name is required",
            })}
            errors={errors}
          />

          {/* Slug */}
          <Input
            label="Slug"
            text="slug"
            register={register("slug", {
              required: "Slug is required",
            })}
            readOnly
            errors={errors}
          />

          {/* Original Price (Editable) */}
          <Input
            label="Original Price"
            text="original_price"
            type="number"
            register={register("original_price", {
              required: "Original price is required",
              setValueAs: (v) => safeNumber(v, 0),
              min: { value: 0, message: "Original price must be >= 0" },
            })}
            errors={errors}
          />

          {/* Discount Price (Editable) */}
          <Input
            label="Discount Price"
            text="discount_price"
            type="number"
            register={register("discount_price", {
              setValueAs: (v) => safeNumber(v, 0),
              min: { value: 0, message: "Discount must be >= 0" },
            })}
            errors={errors}
          />

          {/* Selling Price (Calculated Read-Only: Original - Discount) */}
          <Input
            label="Selling Price"
            text="price"
            type="number"
            register={register("price", {
              setValueAs: (v) => safeNumber(v, 0),
            })}
            readOnly
            errors={errors}
          />

          {/* Stock */}
          <Input
            label="Stock Quantity"
            text="stock"
            type="number"
            register={register("stock", {
              setValueAs: (v) => safeNumber(v, 0),
              min: { value: 0, message: "Stock must be >= 0" },
            })}
            errors={errors}
          />

          {/* Weight */}
          <Input
            label="Weight (kg)"
            text="weight"
            type="number"
            register={register("weight", {
              setValueAs: (v) => safeNumber(v, 0),
              min: { value: 0, message: "Weight must be >= 0" },
            })}
            errors={errors}
          />

          {/* Display Position */}
          <Input
            label="Display Position"
            text="position"
            type="number"
            placeholder="Defaults to last position"
            register={register("position", { valueAsNumber: true })}
            errors={errors}
            required={false}
          />

          {/* Active Status Toggle */}
          <div className="flex flex-col justify-center gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Status
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Is Active (Visible in store)
              </label>
            </div>
          </div>

          {/* Thumbnail Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Product Thumbnail
            </label>

            {thumbnailPreview ? (
              <div className="mb-4">
                <Image
                  src={thumbnailPreview}
                  alt="Product Thumbnail"
                  width={180}
                  height={180}
                  className="h-40 w-40 rounded-lg border object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-lg border bg-gray-100 text-gray-400">
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500
              file:mr-4
              file:py-2
              file:px-4
              file:rounded-full
              file:border-0
              file:font-semibold
              file:bg-emerald-50
              file:text-emerald-700
              hover:file:bg-emerald-100"
            />
          </div>

          {/* Gallery Images */}
          <ProductGalleryUploader
            files={galleryFiles}
            onFilesChange={setGalleryFiles}
            existingImages={existingImages}
          />

          {/* Description */}
          <div className="col-span-full">
            <WebEditor
              label="Description (Optional)"
              content={description}
              setContent={setDescription}
              placeholder="Write the full product description..."
            />
          </div>

          {/* Specifications */}
          <div className="col-span-full flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              Specifications (Optional)
            </label>

            {specifications.length > 0 && (
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-800">
                        {spec.label}
                      </span>
                      <span className="text-sm text-gray-500 mx-2">:</span>
                      <span className="text-sm text-gray-600">
                        {spec.value}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                      className="text-red-500 hover:text-red-600 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg border border-gray-200 p-3">
              <input
                type="text"
                value={specLabel}
                onChange={(e) => setSpecLabel(e.target.value)}
                placeholder="Label (e.g. Weight)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpecification();
                  }
                }}
                placeholder="Value (e.g. 500g)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="sm:col-span-2 flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={16} />
                Add Specification
              </button>
            </div>
          </div>

          {/* SEO Meta Title */}
          <Input
            label="Meta Title (Optional)"
            text="meta_title"
            register={register("meta_title")}
            errors={errors}
          />

          {/* SEO Meta Keywords */}
          <Input
            label="Meta Keywords (Optional)"
            text="meta_keywords"
            register={register("meta_keywords")}
            errors={errors}
          />

          {/* SEO Meta Description */}
          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Meta Description (Optional)
            </label>
            <textarea
              rows={3}
              {...register("meta_description")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter SEO description for search engines..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isUpdating ? "Updating..." : "Update Product"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProducts;
