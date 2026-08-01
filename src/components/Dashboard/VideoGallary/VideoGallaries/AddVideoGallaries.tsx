"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus, Upload } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import { useCreateVideoGallaryMutation } from "@/src/redux/api/videoGallaryApi";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import Textarea from "@/src/components/common/Form/Textarea";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import { useGetAllVideoGalleryCategoriesQuery } from "@/src/redux/api/videoGallaryCategoryApi";

interface AddVideoGallaryFormValues {
  video_gallary_category_id: string;
  title: string;
  slug: string;
  video_url: string;
  description?: string;
  thumbnail?: FileList;
  is_active: boolean;
}

const AddVideoGallaries: React.FC = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [createVideoGallary, { isLoading }] = useCreateVideoGallaryMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllVideoGalleryCategoriesQuery({ limit: 200 });

  // Map VideoGalleryCategory items so that each item has a `name` property required by SelectOption
  const categories = (categoriesData?.data || []).map((cat) => ({
    ...cat,
    name: cat.title || "Unnamed Category",
  }));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddVideoGallaryFormValues>({
    defaultValues: {
      video_gallary_category_id: "",
      title: "",
      video_url: "",
      description: "",
    },
  });

  const categoryIdValue = watch("video_gallary_category_id");
  const thumbnailValue = watch("thumbnail");

  // Image preview handler
  useEffect(() => {
    if (thumbnailValue && thumbnailValue.length > 0) {
      const file = thumbnailValue[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [thumbnailValue]);

  const onSubmit: SubmitHandler<AddVideoGallaryFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append(
        "video_gallary_category_id",
        values.video_gallary_category_id,
      );
      formData.append("title", values.title);
      formData.append("video_url", values.video_url);
      formData.append("description", values.description || "");
      if (values.thumbnail?.[0]) {
        formData.append("thumbnail", values.thumbnail[0]);
      }

      await createVideoGallary(formData).unwrap();
      toast.success("Video gallery created successfully!");
      reset();
      router.push("/dashboard/video-gallaries/all-video-gallaries");
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
        title="Add Video Gallery"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Video Galleries",
            link: "/dashboard/video-gallaries/all-video-gallaries",
          },
          {
            title: "Add Video Gallery",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Searchable Category Dropdown */}
          <SelectAndSearch<AddVideoGallaryFormValues>
            label="Video Category"
            options={categories}
            name="video_gallary_category_id"
            value={categoryIdValue}
            setValue={setValue}
            errors={errors}
            placeholder="Select video category"
            required={true}
            disabled={isCategoriesLoading}
          />

          {/* Video Title */}
          <Input
            label="Video Title"
            text="title"
            register={register("title", {
              required: "Video title is required",
            })}
            errors={errors}
          />

          {/* Video URL */}
          <Input
            label="Video URL (YouTube/Vimeo/Direct Link)"
            text="video_url"
            register={register("video_url", {
              required: "Video URL is required",
              pattern: {
                value:
                  /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/,
                message: "Please enter a valid URL",
              },
            })}
            placeholder="https://www.youtube.com/watch?v=..."
            errors={errors}
          />

          {/* Video Description */}
          <Textarea
            label="Description"
            text="description"
            placeholder="Enter a brief description of the video..."
            register={register("description")}
            errors={errors}
            required={false}
            className="col-span-full"
          />

          {/* Thumbnail Upload with Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Video Thumbnail Image
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imagePreview ? (
                <div className="relative h-24 w-40 rounded-lg border overflow-hidden bg-black/5 shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Thumbnail Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 text-gray-400 shrink-0">
                  <Upload size={24} />
                </div>
              )}

              <div className="w-full">
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
                  hover:file:bg-emerald-100
                  cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Allowed formats: JPG, PNG, WEBP. Recommended resolution:
                  1280x720.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-gray-700 cursor-pointer"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isLoading ? "Creating..." : "Create Video Gallery"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddVideoGallaries;
