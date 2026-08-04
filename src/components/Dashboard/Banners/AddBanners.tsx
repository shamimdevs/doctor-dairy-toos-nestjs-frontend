"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus, ArrowLeft, X, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import { BannerType } from "@/src/types/bannerType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { useCreateBannerBulkMutation } from "@/src/redux/api/bannerApi";

interface AddBannerFormValues {
  title: string;
  type: BannerType;
  redirect_url?: string;
  is_active: boolean;
}

interface StagedImage {
  file: File;
  previewUrl: string;
}

const AddBanners = () => {
  const router = useRouter();
  const [images, setImages] = useState<StagedImage[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const [createBannerBulk, { isLoading }] = useCreateBannerBulkMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddBannerFormValues>({
    defaultValues: {
      title: "",
      type: "hero_slider",
      redirect_url: "",
      is_active: true,
    },
  });

  const selectedType = watch("type");

  // Clean up object URLs when images change/unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const next = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...next]);
    setFileError(null);
    e.target.value = ""; // allow re-selecting the same file(s) later
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const sideCardWarning = useMemo(
    () => selectedType === "hero_side" && images.length > 2,
    [selectedType, images.length],
  );

  const onSubmit: SubmitHandler<AddBannerFormValues> = async (values) => {
    if (images.length === 0) {
      setFileError("Select at least one image to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("is_active", String(values.is_active));

      if (values.redirect_url && values.redirect_url.trim() !== "") {
        formData.append("redirect_url", values.redirect_url.trim());
      }

      images.forEach((img) => formData.append("images", img.file));

      await createBannerBulk(formData).unwrap();
      toast.success(
        images.length > 1
          ? `${images.length} banners created successfully!`
          : "Banner created successfully!",
      );
      router.push("/dashboard/banners/all-banners");
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
        title="Add Banner"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Banners", link: "/dashboard/banners/all-banners" },
          { title: "Add Banner" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <Input
            label="Title"
            text="title"
            placeholder="e.g. Summer Sale"
            register={register("title", {
              required: "Title is required",
            })}
            errors={errors}
          />

          {/* Placement type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Placement <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="hero_slider">Hero Slider (carousel)</option>
              <option value="hero_side">Hero Side Card (max 2 active)</option>
            </select>
            {sideCardWarning && (
              <p className="text-amber-600 text-xs mt-1">
                Only 2 active side-card banners are allowed at a time — extra
                uploads may be rejected.
              </p>
            )}
          </div>

          {/* Redirect URL */}
          <Input
            label="Redirect URL (Optional)"
            text="redirect_url"
            placeholder="https://example.com/products/summer-sale"
            register={register("redirect_url")}
            errors={errors}
            required={false}
          />

          {/* Active toggle */}
          <div className="flex items-center gap-2 pt-6">
            <input
              id="is_active"
              type="checkbox"
              {...register("is_active")}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          {/* Multi-Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Banner Images
              <span className="ml-1 text-red-500">*</span>
              <span className="ml-2 font-normal text-gray-400">
                (select multiple — one banner is created per image)
              </span>
            </label>

            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-8 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition"
            >
              <ImagePlus className="h-6 w-6 text-emerald-600" />
              Click to choose image(s) — JPG, PNG, GIF, WEBP (max 5MB each)
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />

            {fileError && (
              <p className="text-red-500 text-xs mt-2">{fileError}</p>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div
                    key={img.previewUrl}
                    className="relative h-28 rounded-lg overflow-hidden border border-gray-200 bg-white group"
                  >
                    <Image
                      src={img.previewUrl}
                      alt={`Selected image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={
              isLoading
                ? "Saving..."
                : images.length > 1
                  ? `Create ${images.length} Banners`
                  : "Create Banner"
            }
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddBanners;
