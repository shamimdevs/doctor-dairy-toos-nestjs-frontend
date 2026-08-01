"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Star, Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import Textarea from "@/src/components/common/Form/Textarea";
import {
  useGetSingleTestimonialQuery,
  useUpdateTestimonialMutation,
} from "@/src/redux/api/testimonialApi";

interface EditTestimonialsProps {
  id: string;
}

interface EditTestimonialFormValues {
  name: string;
  designation: string;
  description: string;
  rating: number;
  product_id?: string;
  reviewGenerated?: number;
  performance?: number;
  image?: FileList;
}

const EditTestimonials: React.FC<EditTestimonialsProps> = ({ id }) => {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  // RTK Query Hooks
  const { data: testimonialData, isLoading: isFetching } =
    useGetSingleTestimonialQuery(id, { skip: !id });
  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateTestimonialMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditTestimonialFormValues>();

  const ratingValue = watch("rating", 5);

  // Populate form defaults when single testimonial data is loaded
  useEffect(() => {
    if (testimonialData?.data) {
      const item = testimonialData.data;
      reset({
        name: item.name || "",
        designation: item.designation || "",
        description: item.description || "",
        rating: item.rating ?? 5,
        product_id: item.product_id || "",
        reviewGenerated: item.reviewGenerated ?? undefined,
        performance: item.performance ?? undefined,
      });

      if (item.image) {
        setImagePreview(item.image);
      }
    }
  }, [testimonialData, reset]);

  // Combined change handler to update image preview & trigger React Hook Form update
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rhfOnChange: React.ChangeEventHandler<HTMLInputElement>,
  ) => {
    rhfOnChange(e);
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<EditTestimonialFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("designation", values.designation);
      formData.append("description", values.description);
      formData.append("rating", String(values.rating));

      if (values.product_id) {
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

      await updateTestimonial({ id, data: formData }).unwrap();
      toast.success("Testimonial updated successfully!");
      router.push("/dashboard/testimonials");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Failed to update testimonial.",
        icon: "error",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-white p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading testimonial details...</span>
        </div>
      </div>
    );
  }

  const imageRegistration = register("image");

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Edit Testimonial"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Testimonials",
            link: "/dashboard/testimonials",
          },
          {
            title: "Edit Testimonial",
          },
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

          {/* Related Product/Service UUID */}
          <Input
            label="Related Service/Product ID (Optional UUID)"
            text="product_id"
            register={register("product_id")}
            errors={errors}
          />

          {/* Interactive Star Rating */}
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
          <Textarea
            label="Testimonial Message"
            text="description"
            placeholder="Write client testimonial review here..."
            register={register("description", {
              required: "Testimonial description cannot be empty",
            })}
            errors={errors}
            required={true}
            className="col-span-full"
          />

          {/* Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Client Profile Image
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imagePreview ? (
                <div className="relative h-28 w-28 overflow-hidden rounded-full border border-gray-200 bg-white shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Client Profile Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-28 w-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 text-gray-400 shrink-0">
                  <Upload size={24} />
                </div>
              )}

              <div className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  name={imageRegistration.name}
                  ref={imageRegistration.ref}
                  onBlur={imageRegistration.onBlur}
                  onChange={(e) =>
                    handleImageChange(e, imageRegistration.onChange)
                  }
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:font-semibold file:bg-emerald-50
                  file:text-emerald-700 hover:file:bg-emerald-100
                  cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Allowed formats: JPG, PNG, WEBP. Recommended size: Square
                  profile picture.
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
            text={isUpdating ? "Updating..." : "Update Testimonial"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditTestimonials;
