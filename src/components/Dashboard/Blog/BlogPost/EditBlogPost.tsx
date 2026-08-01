"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import {
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} from "@/src/redux/api/blogApi";
import { useGetAllBlogCategoriesQuery } from "@/src/redux/api/blogCategoryApi";

import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";

interface EditBlogPostProps {
  id: string;
}

interface EditBlogPostFormValues {
  category_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_name?: string;
  read_time?: string;
  image?: FileList;
  status: boolean;
  is_featured: boolean;
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

const EditBlogPost: React.FC<EditBlogPostProps> = ({ id }) => {
  const router = useRouter();

  const { data: blogData, isLoading: isFetchingBlog } =
    useGetSingleBlogQuery(id);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllBlogCategoriesQuery({ limit: 200 });

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [imagePreview, setImagePreview] = useState<string>("");

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
  } = useForm<EditBlogPostFormValues>({
    defaultValues: {
      category_id: "",
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: true,
      is_featured: false,
      meta_title: "",
      meta_keywords: "",
      meta_description: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const titleValue = watch("title");
  const categoryIdValue = watch("category_id");

  // Populate existing data
  useEffect(() => {
    if (blogData?.data) {
      const blog = blogData.data;

      reset({
        category_id: blog.category_id || "",
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        status: blog.status ?? true,
        is_featured: blog.is_featured ?? false,
        author_name: blog.author_name || "",
        read_time: blog.read_time || "",
        meta_title: blog.meta_title || "",
        meta_keywords: blog.meta_keywords || "",
        meta_description: blog.meta_description || "",
      });

      if (blog.image) {
        setImagePreview(blog.image);
      }
    }
  }, [blogData, reset]);

  // Sync Slug on Title Change
  useEffect(() => {
    if (titleValue) {
      setValue("slug", generateSlug(titleValue));
    }
  }, [titleValue, setValue]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<EditBlogPostFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("category_id", values.category_id);
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", values.content);
      formData.append("status", String(values.status));
      formData.append("is_featured", String(values.is_featured));

      if (values.excerpt) formData.append("excerpt", values.excerpt);
      if (values.author_name)
        formData.append("author_name", values.author_name);
      if (values.read_time) formData.append("read_time", values.read_time);

      // Match backend key ('image')
      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await updateBlog({
        id,
        data: formData,
      }).unwrap();

      toast.success("Blog post updated successfully!");
      router.push("/dashboard/blogs/all-posts");
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

  if (isFetchingBlog) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        Loading blog post details...
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Edit Blog Post"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Blogs", link: "/dashboard/blogs/all-posts" },
          { title: "Edit Post" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <Input
            label="Post Title"
            text="title"
            register={register("title", { required: "Post title is required" })}
            errors={errors}
          />

          <Input
            label="Slug"
            text="slug"
            register={register("slug", { required: "Slug is required" })}
            readOnly
            errors={errors}
          />

          {/* Status & Featured Flags */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="status"
                {...register("status")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="status"
                className="text-sm font-semibold text-gray-700"
              >
                Active / Published
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                {...register("is_featured")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-semibold text-gray-700"
              >
                Featured Post
              </label>
            </div>
          </div>

          <div className="col-span-full flex flex-col gap-1">
            <label className="font-semibold text-sm text-gray-700">
              Excerpt (Optional Summary)
            </label>
            <textarea
              rows={2}
              {...register("excerpt")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Brief summary..."
            />
          </div>

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
              placeholder="Write your content here..."
            />
            {errors.content && (
              <span className="text-xs text-red-500">
                {errors.content.message}
              </span>
            )}
          </div>

          {/* Featured Image */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Featured Image / Cover
            </label>

            {imagePreview ? (
              <div className="mb-4">
                <Image
                  src={imagePreview}
                  alt="Blog Thumbnail"
                  width={180}
                  height={180}
                  className="h-40 w-40 rounded-lg border object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-lg border bg-gray-100 text-gray-400">
                No Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              {...register("image", { onChange: handleThumbnailChange })}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
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
            text={isUpdating ? "Updating..." : "Update Post"}
            icon={Save}
            disabled={isUpdating}
          />
        </div>
      </form>
    </div>
  );
};

export default EditBlogPost;
