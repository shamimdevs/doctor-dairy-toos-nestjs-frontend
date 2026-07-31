"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import { useCreateProductMutation } from "@/src/redux/api/productsApi";
import { useGetAllProductCategoriesQuery } from "@/src/redux/api/productCategoriesApi";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";

interface AddProductFormValues {
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

const AddProducts = () => {
  const router = useRouter();

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllProductCategoriesQuery({ limit: 200 });

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddProductFormValues>({
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
  const priceValue = watch("price");
  const discountPriceValue = watch("discount_price");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue));
    } else {
      setValue("slug", "");
    }
  }, [nameValue, setValue]);

  // Dynamically compute Original Price = Price - Discount Price
  useEffect(() => {
    const price = Number(priceValue) || 0;
    const discount = Number(discountPriceValue) || 0;
    const calculatedOriginal = Math.max(0, price - discount);

    setValue("original_price", calculatedOriginal);
  }, [priceValue, discountPriceValue, setValue]);

  const onSubmit: SubmitHandler<AddProductFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("category_id", values.category_id);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("price", String(Number(values.price)));
      formData.append("is_active", String(values.is_active));

      if (
        values.discount_price !== undefined &&
        values.discount_price !== null &&
        !isNaN(values.discount_price)
      ) {
        formData.append(
          "discount_price",
          String(Number(values.discount_price)),
        );
      }
      if (
        values.stock !== undefined &&
        values.stock !== null &&
        !isNaN(values.stock)
      ) {
        formData.append("stock", String(Number(values.stock)));
      }
      if (
        values.weight !== undefined &&
        values.weight !== null &&
        !isNaN(values.weight)
      ) {
        formData.append("weight", String(Number(values.weight)));
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

      if (values.thumbnail?.[0]) {
        formData.append("thumbnail", values.thumbnail[0]);
      }

      await createProduct(formData).unwrap();
      toast.success("Product created successfully!");
      reset();
      router.push("/dashboard/products/all-products");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Submission Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Create Product"
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
            title: "Add Product",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Searchable Category Dropdown */}
          <SelectAndSearch<AddProductFormValues>
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

          {/* Selling Price */}
          <Input
            label="Original Price "
            text="price"
            type="number"
            register={register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be >= 0" },
            })}
            errors={errors}
          />

          {/* Discount Price */}
          <Input
            label="Discount Price "
            text="discount_price"
            type="number"
            register={register("discount_price", {
              valueAsNumber: true,
              min: { value: 0, message: "Discount must be >= 0" },
            })}
            errors={errors}
          />

          {/* Calculated Original Price (Read-only for display) */}
          <Input
            label="Selling Price "
            text="original_price"
            type="number"
            register={register("original_price")}
            readOnly
            errors={errors}
          />

          {/* Stock */}
          <Input
            label="Stock Quantity"
            text="stock"
            type="number"
            register={register("stock", {
              valueAsNumber: true,
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
              valueAsNumber: true,
              min: { value: 0, message: "Weight must be >= 0" },
            })}
            errors={errors}
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

          {/* Thumbnail Image Upload */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Product Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("thumbnail")}
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

        {/* Buttons */}
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
            text={isLoading ? "Creating..." : "Create Product"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
