"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";

import { ApiError } from "@/src/types/authType";
import { useCreateProductCategoryMutation } from "@/src/redux/api/productCategoriesApi";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { toast } from "react-toastify";

interface AddProductCategoryFormValues {
  name: string;
  slug: string;
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

const AddProductCategory = () => {
  const router = useRouter();

  const [createCategory, { isLoading }] = useCreateProductCategoryMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddProductCategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue));
    } else {
      setValue("slug", "");
    }
  }, [nameValue, setValue]);

  const onSubmit: SubmitHandler<AddProductCategoryFormValues> = async (
    values,
  ) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("slug", values.slug);

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await createCategory(formData).unwrap();
      toast.success("Product category updated successfully!");
      reset();
      router.push("/dashboard/product-category/all-product-category");
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
        title="Create Product Category"
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
            title: "Add Category",
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

          <div className="col-span-full border-2 border-dashed rounded-lg p-4 hover:border-blue-400">
            <label className="block mb-2 font-semibold text-sm">
              Category Image
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("image")}
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

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isLoading ? "Creating..." : "Create Category"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddProductCategory;
