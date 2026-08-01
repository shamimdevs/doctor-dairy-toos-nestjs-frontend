"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import { useGetAllBlogCategoriesQuery } from "@/src/redux/api/blogCategoryApi";
import { useCreateBlogMutation } from "@/src/redux/api/blogApi";

interface AddBlogPostFormValues {
  category_id: string;
  title: string;
  slug: string;
  author_name?: string;
  content: string;
  excerpt?: string;
  image?: FileList;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
}

// Supports English + Bangla Unicode slug generation
const generateSlug = (text: string) => {
  return text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/-+/g, "-");
};

const AddBlogPost = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [createBlogPost, { isLoading }] = useCreateBlogMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllBlogCategoriesQuery({ limit: 200 });

  // Map BlogCategory items to conform to the SelectOption[] requirements
  const categories =
    categoriesData?.data?.map((cat) => ({
      ...cat,
      name: cat.category_name || "",
    })) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddBlogPostFormValues>({
    defaultValues: {
      category_id: "",
      title: "",
      slug: "",
      author_name: "",
      content: "",
      excerpt: "",
      meta_title: "",
      meta_keywords: "",
      meta_description: "",
    },
  });

  const titleValue = watch("title");
  const categoryIdValue = watch("category_id");
  const imageFileList = watch("image");

  // Auto-generate slug from post title
  useEffect(() => {
    if (titleValue) {
      setValue("slug", generateSlug(titleValue), { shouldValidate: true });
    } else {
      setValue("slug", "");
    }
  }, [titleValue, setValue]);

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

  const onSubmit: SubmitHandler<AddBlogPostFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("category_id", values.category_id);
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", values.content);

      if (values.author_name) {
        formData.append("author_name", values.author_name);
      }
      if (values.excerpt) {
        formData.append("excerpt", values.excerpt);
      }
      if (values.meta_title) {
        formData.append("meta_title", values.meta_title);
      }
      if (values.meta_keywords) {
        formData.append("meta_keywords", values.meta_keywords);
      }
      if (values.meta_description) {
        formData.append("meta_description", values.meta_description);
      }

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await createBlogPost(formData).unwrap();
      toast.success("Blog post created successfully!");
      reset();
      setImagePreview(null);
      router.push("/dashboard/blog/blog-posts/all-blog-posts");
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
        title="Create Blog Post"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Blogs",
            link: "/dashboard/blog/blog-posts/all-blog-posts",
          },
          {
            title: "Add Post",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <SelectAndSearch<AddBlogPostFormValues>
            label="Category"
            options={categories}
            name="category_id"
            value={categoryIdValue}
            setValue={setValue}
            errors={errors}
            placeholder="Select category"
            required={true}
            disabled={isCategoriesLoading}
          />

          {/* Post Title */}
          <Input
            label="Post Title"
            text="title"
            register={register("title", {
              required: "Post title is required",
            })}
            errors={errors}
          />

          {/* Author Name */}
          <Input
            label="Author Name (Optional)"
            text="author_name"
            register={register("author_name")}
            errors={errors}
          />

          {/* Slug */}
          <Input
            label="Slug"
            text="slug"
            register={register("slug", {
              required: "Slug is required",
            })}
            readOnly
            errors={errors}
          />

          {/* Blog Excerpt */}
          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Excerpt (Optional Summary)
            </label>
            <textarea
              rows={2}
              {...register("excerpt")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Brief summary of the article..."
            />
          </div>

          {/* Main Content Body */}
          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Post Content
            </label>
            <textarea
              rows={8}
              {...register("content", {
                required: "Post content cannot be empty",
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Write your blog post content here..."
            />
            {errors.content && (
              <span className="text-xs text-red-500">
                {errors.content.message}
              </span>
            )}
          </div>

          {/* Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Featured Image / Cover Image
            </label>

            {imagePreview && (
              <div className="relative mb-4 h-44 w-72 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <Image
                  src={imagePreview}
                  alt="Selected Cover Preview"
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

          {/* SEO Meta Title */}
          <Input
            label="Meta Title (Optional)"
            text="meta_title"
            register={register("meta_title")}
            errors={errors}
          />

          {/* SEO Meta Keywords */}
          <Input
            label="Meta Keywords (Optional)"
            text="meta_keywords"
            register={register("meta_keywords")}
            errors={errors}
          />

          {/* SEO Meta Description */}
          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Meta Description (Optional)
            </label>
            <textarea
              rows={3}
              {...register("meta_description")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter SEO description for search engines..."
            />
          </div>
        </div>

        {/* Buttons */}
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
            text={isLoading ? "Publishing..." : "Create Post"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddBlogPost;
