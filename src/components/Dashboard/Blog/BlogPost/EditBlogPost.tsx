"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import { useGetAllBlogCategoriesQuery } from "@/src/redux/api/blogCategoryApi";
import {
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} from "@/src/redux/api/blogApi";

interface EditBlogPostFormValues {
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
  status?: boolean;
  is_featured?: boolean;
}

// Unicode-aware slug generation (Bangla & English support)
const generateSlug = (text: string) => {
  return text
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/-+/g, "-");
};

interface EditBlogPostProps {
  id: string;
}

const EditBlogPost: React.FC<EditBlogPostProps> = ({ id }) => {
  const router = useRouter();
  const blogId = id;

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Queries & Mutations
  const { data: singleBlogData, isLoading: isBlogLoading } =
    useGetSingleBlogQuery(blogId, { skip: !blogId });

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllBlogCategoriesQuery({ limit: 200 });

  const [updateBlogPost, { isLoading: isUpdating }] = useUpdateBlogMutation();

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
    formState: { errors, isDirty },
  } = useForm<EditBlogPostFormValues>({
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
      status: true,
      is_featured: false,
    },
  });

  const titleValue = watch("title");
  const categoryIdValue = watch("category_id");
  const imageFileList = watch("image");

  // Populate form values when fetched blog data arrives
  useEffect(() => {
    if (singleBlogData?.data) {
      const blog = singleBlogData.data;

      reset({
        category_id: blog.category_id || blog.category?.id || "",
        title: blog.title || "",
        slug: blog.slug || "",
        author_name: blog.author_name || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        meta_title: blog.meta_title || "",
        meta_keywords: blog.meta_keywords || "",
        meta_description: blog.meta_description || "",
        status: blog.status ?? true,
        is_featured: blog.is_featured ?? false,
      });

      if (blog.image) {
        setPreviewImage(blog.image);
      }
    }
  }, [singleBlogData, reset]);

  // Regenerate slug dynamically on title change (if manually edited/dirty)
  useEffect(() => {
    if (isDirty && titleValue) {
      setValue("slug", generateSlug(titleValue));
    }
  }, [titleValue, setValue, isDirty]);

  // Local preview update when user selects a new file
  useEffect(() => {
    if (imageFileList && imageFileList.length > 0) {
      const file = imageFileList[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFileList]);

  const onSubmit: SubmitHandler<EditBlogPostFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("category_id", values.category_id);
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", values.content);

      if (values.author_name) {
        formData.append("author_name", values.author_name);
      }
      if (values.excerpt) formData.append("excerpt", values.excerpt);
      if (values.meta_title) formData.append("meta_title", values.meta_title);
      if (values.meta_keywords)
        formData.append("meta_keywords", values.meta_keywords);
      if (values.meta_description)
        formData.append("meta_description", values.meta_description);

      if (values.status !== undefined) {
        formData.append("status", String(values.status));
      }
      if (values.is_featured !== undefined) {
        formData.append("is_featured", String(values.is_featured));
      }

      // Only attach image if a new file was picked
      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await updateBlogPost({ id: blogId, data: formData }).unwrap();
      toast.success("Blog post updated successfully!");
      router.push("/dashboard/blog/blog-posts/all-blog-posts");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong while updating.",
        icon: "error",
      });
    }
  };

  if (isBlogLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border bg-white p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 overflow-hidden">
      <PageHeader
        title="Edit Blog Post"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Blogs", link: "/dashboard/blog/blog-posts/all-blog-posts" },
          { title: "Edit Post" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <SelectAndSearch<EditBlogPostFormValues>
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

          {/* Status & Featured Checkboxes */}
          <div className="flex items-center gap-6 col-span-full md:col-span-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register("status")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Active Status
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register("is_featured")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Featured Post
            </label>
          </div>

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

            {previewImage && (
              <div className="relative mb-4 h-44 w-72 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <Image
                  src={previewImage}
                  alt="Blog Preview"
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
            text={isUpdating ? "Saving..." : "Update Post"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;
