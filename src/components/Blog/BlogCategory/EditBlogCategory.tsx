"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import { CreateBlogCategoryRequest } from "@/src/types/blogCategoryType";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import {
  useGetSingleBlogCategoryQuery,
  useUpdateBlogCategoryMutation,
} from "@/src/redux/api/blogCategoryApi";

interface EditBlogCategoryProps {
  id: string;
}

type FormValues = Required<CreateBlogCategoryRequest>;

const EditBlogCategory: React.FC<EditBlogCategoryProps> = ({ id }) => {
  const router = useRouter();

  const { data, isLoading: isFetching } = useGetSingleBlogCategoryQuery(id);

  const [updateCategory, { isLoading }] = useUpdateBlogCategoryMutation();

  console.log(data, ":blog data");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      category_name: "",
      description: "",
      status: true,
    },
  });

  // ==========================
  // Load Existing Data
  // ==========================
  useEffect(() => {
    if (data?.data) {
      reset({
        category_name: data.data.category_name || "",
        description: data.data.description || "",
        status: data.data.status ?? true,
      });
    }
  }, [data, reset]);

  // ==========================
  // Submit Handler
  // ==========================
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await updateCategory({
        id,
        data: values,
      }).unwrap();

      toast.success("Blog category updated successfully!");
      router.push("/dashboard/blog/blog-category/all-blog-category");
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden p-6">
      <PageHeader
        title="Edit Blog Category"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Blog Categories",
            link: "/dashboard/blog-category/all-blog-categories",
          },
          {
            title: "Edit Category",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Name */}
          <Input
            label="Category Name"
            text="category_name"
            register={register("category_name", {
              required: "Category name is required",
            })}
            errors={errors}
          />

          {/* Description */}
          <Input
            label="Description (Optional)"
            text="description"
            register={register("description")}
            errors={errors}
          />
        </div>

        {/* Status Toggle */}
        <div className="flex flex-col justify-center">
          <label className="block mb-2 font-semibold text-sm text-gray-700">
            Status
          </label>
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="status"
              {...register("status")}
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              Active
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 transition cursor-pointer"
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

export default EditBlogCategory;
