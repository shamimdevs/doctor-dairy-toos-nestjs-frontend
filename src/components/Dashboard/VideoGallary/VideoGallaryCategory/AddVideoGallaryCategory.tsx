"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";

import { CreateVideoGalleryCategoryRequest } from "@/src/types/videoGalleryCategoriesType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { useCreateVideoGalleryCategoryMutation } from "@/src/redux/api/videoGallaryCategoryApi";

const AddVideoGallaryCategory = () => {
  const router = useRouter();

  const [createCategory, { isLoading }] =
    useCreateVideoGalleryCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVideoGalleryCategoryRequest>({
    defaultValues: {
      title: "",
    },
  });

  const onSubmit: SubmitHandler<CreateVideoGalleryCategoryRequest> = async (
    data,
  ) => {
    try {
      await createCategory(data).unwrap();
      toast.success("Video gallery category created successfully!");
      reset();
      router.push(
        "/dashboard/video-gallary-category/all-video-gallary-categories",
      );
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
        title="Create Video Gallery Category"
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
            title: "Add Category",
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
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition"
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

export default AddVideoGallaryCategory;
