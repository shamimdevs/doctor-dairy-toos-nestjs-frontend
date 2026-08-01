/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus, ArrowLeft, Star } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import { useCreateTestimonialMutation } from "@/src/redux/api/testimonialApi";
import { useGetAllProductsQuery } from "@/src/redux/api/productsApi";

interface AddTestimonialFormValues {
  name: string;
  designation: string;
  description: string;
  rating: number;
  product_id?: string;
  reviewGenerated?: number;
  performance?: number;
  image?: FileList;
}

const AddTestimonials = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const [createTestimonial, { isLoading }] = useCreateTestimonialMutation();

  // Fetch products for searchable select
  const { data: productsData, isLoading: isProductsLoading } =
    useGetAllProductsQuery({ limit: 200 });

  // Map products to conform to SelectOption interface
  const productOptions =
    productsData?.data?.map((product: any) => ({
      id: product.id,
      name: product.title || product.name || "Unnamed Product",
    })) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddTestimonialFormValues>({
    defaultValues: {
      name: "",
      designation: "",
      description: "",
      rating: 5,
      product_id: "",
    },
  });

  const ratingValue = watch("rating", 5);
  const productIdValue = watch("product_id");
  const imageFileList = watch("image");

  // Dynamic Image Preview Handler
  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0];
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFileList]);

  const onSubmit: SubmitHandler<AddTestimonialFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("designation", values.designation);
      formData.append("description", values.description);
      formData.append("rating", String(values.rating));

      // Append product_id ONLY if a non-empty UUID string is selected
      if (values.product_id && values.product_id.trim() !== "") {
        formData.append("product_id", values.product_id);
      }

      if (
        values.reviewGenerated !== undefined &&
        values.reviewGenerated !== null &&
        !isNaN(values.reviewGenerated)
      ) {
        formData.append("reviewGenerated", String(values.reviewGenerated));
      }

      if (
        values.performance !== undefined &&
        values.performance !== null &&
        !isNaN(values.performance)
      ) {
        formData.append("performance", String(values.performance));
      }

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await createTestimonial(formData).unwrap();
      toast.success("Testimonial created successfully!");
      reset();
      setImagePreview(null);
      router.push("/dashboard/testimonials/all-testimonials");
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
        title="Add Testimonial"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Testimonials", link: "/dashboard/testimonials" },
          { title: "Add Testimonial" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <Input
            label="Client Name"
            text="name"
            register={register("name", {
              required: "Client name is required",
            })}
            errors={errors}
          />

          {/* Client Designation */}
          <Input
            label="Designation"
            text="designation"
            register={register("designation", {
              required: "Designation is required",
            })}
            errors={errors}
          />

          {/* Related Product Searchable Dropdown */}
          <SelectAndSearch<AddTestimonialFormValues>
            label="Related Product (Optional)"
            options={productOptions}
            name="product_id"
            value={productIdValue}
            setValue={setValue}
            errors={errors}
            placeholder="Search and select product"
            required={false}
            disabled={isProductsLoading}
          />

          {/* Star Rating Selection */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Rating (0–5)
            </label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setValue("rating", star, { shouldValidate: true })
                  }
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 focus:outline-none transition cursor-pointer"
                >
                  <Star
                    size={22}
                    className={`${
                      star <= (hoveredRating ?? ratingValue)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    } transition`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {ratingValue} / 5
              </span>
            </div>
          </div>

          {/* Reviews Generated */}
          <Input
            label="Reviews Generated (Optional)"
            text="reviewGenerated"
            type="number"
            register={register("reviewGenerated", { valueAsNumber: true })}
            errors={errors}
          />

          {/* Performance Score */}
          <Input
            label="Performance Score (Optional)"
            text="performance"
            type="number"
            register={register("performance", { valueAsNumber: true })}
            errors={errors}
          />

          {/* Testimonial Message */}
          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Testimonial Message
            </label>
            <textarea
              rows={5}
              {...register("description", {
                required: "Testimonial description cannot be empty",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Write client testimonial review here..."
            />
            {errors.description && (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Client Profile Image
            </label>

            {imagePreview && (
              <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                <Image
                  src={imagePreview}
                  alt="Client Profile Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("image")}
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
            text={isLoading ? "Saving..." : "Create Testimonial"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddTestimonials;
