"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import { CreateBlogCategoryRequest } from "@/src/types/blogCategoryType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { useCreateBlogCategoryMutation } from "@/src/redux/api/blogCategoryApi";

const AddBlogCategory = () => {
  const router = useRouter();

  const [createBlogCategory, { isLoading }] = useCreateBlogCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBlogCategoryRequest>({
    defaultValues: {
      category_name: "",
      description: "",
      status: true,
    },
  });

  const onSubmit: SubmitHandler<CreateBlogCategoryRequest> = async (data) => {
    try {
      await createBlogCategory(data).unwrap();
      toast.success("Blog category created successfully!");
      reset();
      router.push("/dashboard/blog-category/all-blog-categories");
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
        title="Create Blog Category"
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
            title: "Add Category",
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

        {/* Status Toggle / Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="status"
            {...register("status")}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label
            htmlFor="status"
            className="text-sm font-medium text-gray-700 cursor-pointer select-none"
          >
            Mark as Active
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
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

export default AddBlogCategory;
