"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save } from "lucide-react";

import { ApiError } from "@/src/types/authType";
import {
  useGetSingleProductCategoryQuery,
  useUpdateProductCategoryMutation,
} from "@/src/redux/api/productCategoriesApi";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { toast } from "react-toastify";

interface EditProductCategoryProps {
  id: string;
}

interface EditProductCategoryFormValues {
  name: string;
  slug: string;
  position?: number;
  image?: FileList;
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

const EditProductCategory: React.FC<EditProductCategoryProps> = ({ id }) => {
  const router = useRouter();

  const { data, isLoading: isFetching } = useGetSingleProductCategoryQuery(id);

  const [updateCategory, { isLoading }] = useUpdateProductCategoryMutation();

  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProductCategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // ==========================
  // Load Existing Data
  // ==========================
  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name,
        slug: data.data.slug,
        position: data.data.position,
      });
      setImagePreview(data?.data?.image || "");
    }
  }, [data, reset]);

  // ==========================
  // Auto Slug
  // ==========================
  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue));
    } else {
      setValue("slug", "");
    }
  }, [nameValue, setValue]);

  // ==========================
  // Image Preview
  // ==========================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
  };

  // ==========================
  // Submit
  // ==========================
  const onSubmit: SubmitHandler<EditProductCategoryFormValues> = async (
    values,
  ) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("slug", values.slug);

      if (values.position !== undefined && !isNaN(values.position)) {
        formData.append("position", String(values.position));
      }

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await updateCategory({
        id,
        data: formData,
      }).unwrap();
      router.push("/dashboard/product-category/all-product-category");
      toast.success("Product category updated successfully!");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong.",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden p-6">
      <PageHeader
        title="Edit Product Category"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Product Categories",
            link: "/dashboard/product-category/all-product-category",
          },
          {
            title: "Edit Category",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Category Name"
            text="name"
            register={register("name", {
              required: "Category name is required",
            })}
            errors={errors}
          />

          <Input
            label="Slug"
            text="slug"
            register={register("slug", {
              required: "Slug is required",
            })}
            readOnly
            errors={errors}
          />

          <Input
            label="Display Position"
            text="position"
            type="number"
            register={register("position", { valueAsNumber: true })}
            errors={errors}
            required={false}
          />

          {/* Image */}
          <div className="col-span-full">
            <label className="block mb-2 font-semibold text-sm">
              Category Image
            </label>

            <div className="border-2 border-dashed rounded-lg p-5">
              {imagePreview ? (
                <div className="mb-4">
                  <Image
                    src={imagePreview}
                    alt="Category"
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
                {...register("image")}
                onChange={handleImageChange}
                className="block w-full text-sm
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-full
                file:border-0
                file:font-semibold
                file:bg-blue-50
                file:text-blue-700
                hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isLoading ? "Updating..." : "Update Category"}
            icon={Save}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProductCategory;
