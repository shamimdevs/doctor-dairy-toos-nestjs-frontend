"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save, Upload } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import {
  useGetSingleVideoGallaryQuery,
  useUpdateVideoGallaryMutation,
} from "@/src/redux/api/videoGallaryApi";
import { useGetAllVideoGalleryCategoriesQuery } from "@/src/redux/api/videoGallaryCategoryApi";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import Textarea from "@/src/components/common/Form/Textarea";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";

interface EditVideoGallariesProps {
  id: string;
}

interface EditVideoGallaryFormValues {
  video_gallary_category_id: string;
  title: string;
  video_url: string;
  description?: string;
  thumbnail?: FileList;
}

const EditVideoGallaries: React.FC<EditVideoGallariesProps> = ({ id }) => {
  const router = useRouter();

  const { data: videoData, isLoading: isFetchingVideo } =
    useGetSingleVideoGallaryQuery(id);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllVideoGalleryCategoriesQuery({ limit: 200 });

  const [updateVideoGallary, { isLoading: isUpdating }] =
    useUpdateVideoGallaryMutation();

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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
  } = useForm<EditVideoGallaryFormValues>({
    defaultValues: {
      video_gallary_category_id: "",
      title: "",
      video_url: "",
      description: "",
    },
  });

  const categoryIdValue = watch("video_gallary_category_id");

  useEffect(() => {
    if (videoData?.data) {
      const video = videoData.data;

      reset({
        video_gallary_category_id: video.video_gallary_category_id || "",
        title: video.title || "",
        video_url: video.video_url || "",
        description: video.description || "",
      });

      if (video.thumbnail) {
        setThumbnailPreview(video.thumbnail);
      }
    }
  }, [videoData, reset]);

  // Combined change handler to update preview & register state
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rhfOnChange: React.ChangeEventHandler<HTMLInputElement>,
  ) => {
    rhfOnChange(e); // Trigger React Hook Form update
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<EditVideoGallaryFormValues> = async (
    values,
  ) => {
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

      await updateVideoGallary({
        id,
        data: formData,
      }).unwrap();

      toast.success("Video gallery updated successfully!");
      router.push("/dashboard/video-gallaries/all-video-gallaries");
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

  if (isFetchingVideo) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        Loading video gallery details...
      </div>
    );
  }

  const thumbnailRegistration = register("thumbnail");

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Edit Video Gallery"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          {
            title: "Video Galleries",
            link: "/dashboard/video-gallaries/all-video-gallaries",
          },
          { title: "Edit Video Gallery" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectAndSearch<EditVideoGallaryFormValues>
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

          <Input
            label="Video Title"
            text="title"
            register={register("title", {
              required: "Video title is required",
            })}
            errors={errors}
          />

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

          <Textarea
            label="Description"
            text="description"
            placeholder="Enter a brief description of the video..."
            register={register("description")}
            errors={errors}
            required={false}
            className="col-span-full"
          />

          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Video Thumbnail Image
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {thumbnailPreview ? (
                <div className="relative h-24 w-40 rounded-lg border overflow-hidden bg-black/5 shrink-0">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    fill
                    className="object-cover"
                    unoptimized
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
                  name={thumbnailRegistration.name}
                  ref={thumbnailRegistration.ref}
                  onBlur={thumbnailRegistration.onBlur}
                  onChange={(e) =>
                    handleThumbnailChange(e, thumbnailRegistration.onChange)
                  }
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:font-semibold file:bg-emerald-50
                  file:text-emerald-700 hover:file:bg-emerald-100
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
            text={isUpdating ? "Updating..." : "Update Video Gallery"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditVideoGallaries;
