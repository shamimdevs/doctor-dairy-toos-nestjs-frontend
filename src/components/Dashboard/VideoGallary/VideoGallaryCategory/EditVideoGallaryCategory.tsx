"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";

import { CreateVideoGalleryCategoryRequest } from "@/src/types/videoGalleryCategoriesType";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import {
  useGetSingleVideoGalleryCategoryQuery,
  useUpdateVideoGalleryCategoryMutation,
} from "@/src/redux/api/videoGallaryCategoryApi";

interface EditVideoGallaryCategoryProps {
  id: string;
}

// Form values type based on what the form collects directly
type FormValues = Required<CreateVideoGalleryCategoryRequest>;

const EditVideoGallaryCategory: React.FC<EditVideoGallaryCategoryProps> = ({
  id,
}) => {
  const router = useRouter();

  const { data, isLoading: isFetching } =
    useGetSingleVideoGalleryCategoryQuery(id);

  const [updateCategory, { isLoading }] =
    useUpdateVideoGalleryCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      is_active: true,
    },
  });

  // ==========================
  // Load Existing Data
  // ==========================
  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title,
        is_active: data.data.is_active,
      });
    }
  }, [data, reset]);

  // ==========================
  // Submit
  // ==========================
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // Pass { id, data } to match UpdateVideoGalleryCategoryRequest
      await updateCategory({
        id,
        data: values,
      }).unwrap();

      toast.success("Video gallery category updated successfully!");
      router.push(
        "/dashboard/video-gallary-category/all-video-gallary-categories",
      );
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
      <div className="rounded-lg border border-gray-200 bg-white p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 w-full bg-gray-200 rounded mb-3"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden p-6">
      <PageHeader
        title="Edit Video Gallery Category"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Video Gallery Categories",
            link: "/dashboard/video-gallary-category/all-video-gallary-categories",
          },
          {
            title: "Edit Category",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Category Title"
            text="title"
            register={register("title", {
              required: "Category title is required",
            })}
            errors={errors}
          />

          <div className="flex flex-col justify-center">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Status
            </label>
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="is_active"
                {...register("is_active")}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 transition"
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

export default EditVideoGallaryCategory;
