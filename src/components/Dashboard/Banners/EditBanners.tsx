"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import { BannerType } from "@/src/types/bannerType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import {
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
} from "@/src/redux/api/bannerApi";

interface EditBannersProps {
  id: string;
}

interface EditBannerFormValues {
  title: string;
  type: BannerType;
  redirect_url?: string;
  position?: number;
  is_active: boolean;
  image?: FileList;
}

const EditBanners: React.FC<EditBannersProps> = ({ id }) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: bannerData, isLoading: isFetching } =
    useGetSingleBannerQuery(id);

  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBannerFormValues>();

  // Sync form defaults once the banner loads/refetches.
  useEffect(() => {
    if (bannerData?.data) {
      const item = bannerData.data;
      reset({
        title: item.title || "",
        type: item.type,
        redirect_url: item.redirect_url || "",
        position: item.position,
        is_active: item.is_active,
      });
    }
  }, [bannerData, reset]);

  // Newly picked file takes priority over the currently stored image.
  const imagePreview = useMemo(() => {
    if (selectedFile) return URL.createObjectURL(selectedFile);
    return bannerData?.data?.image_url ?? null;
  }, [selectedFile, bannerData]);

  useEffect(() => {
    return () => {
      if (selectedFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [selectedFile, imagePreview]);

  const onSubmit: SubmitHandler<EditBannerFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("is_active", String(values.is_active));

      if (values.position !== undefined && !isNaN(values.position)) {
        formData.append("position", String(values.position));
      }

      if (values.redirect_url && values.redirect_url.trim() !== "") {
        formData.append("redirect_url", values.redirect_url.trim());
      }

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await updateBanner({ id, data: formData }).unwrap();
      toast.success("Banner updated successfully!");
      router.push("/dashboard/banners/all-banners");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Failed to update banner.",
        icon: "error",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading banner details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Edit Banner"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Banners", link: "/dashboard/banners/all-banners" },
          { title: "Edit Banner" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <Input
            label="Title"
            text="title"
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

          {/* Position */}
          <Input
            label="Display Position"
            text="position"
            type="number"
            register={register("position", { valueAsNumber: true })}
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
              Active
            </label>
          </div>

          {/* Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Banner Image
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imagePreview ? (
                <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-28 w-44 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 text-gray-400 shrink-0">
                  <Upload size={24} />
                </div>
              )}

              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setSelectedFile(e.target.files?.[0] ?? null);
                    },
                  })}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:font-semibold file:bg-emerald-50
                  file:text-emerald-700 hover:file:bg-emerald-100
                  cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Leave empty to keep the current image. Max 5MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-gray-700 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isUpdating ? "Updating..." : "Update Banner"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBanners;
