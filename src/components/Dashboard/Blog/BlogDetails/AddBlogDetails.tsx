"use client";

/* eslint-disable react-hooks/incompatible-library */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";

import { ApiError } from "@/src/types/authType";
import { BlogDetailBulletItem } from "@/src/types/blogDetailsType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import SelectAndSearch from "@/src/components/common/Form/SelectAndSearch";
import WebEditor from "@/src/components/common/text-editor/WebEditor";
import { useGetAllBlogsQuery } from "@/src/redux/api/blogApi";
import { useCreateTizaraBlogDetailMutation } from "@/src/redux/api/blogDetailsApi";

interface AddBlogDetailsFormValues {
  blog_id: string;
  heading: string;
  section_key?: string;
  position?: number;
  status: boolean;
  image?: FileList;
}

interface AddBlogDetailsProps {
  defaultBlogId?: string;
}

const ALL_BLOG_DETAILS_PATH = "/dashboard/blog/blog-details/all-blog-details";

const AddBlogDetails: React.FC<AddBlogDetailsProps> = ({ defaultBlogId }) => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [body, setBody] = useState("");

  const [titles, setTitles] = useState<string[]>([]);
  const [titleInput, setTitleInput] = useState("");

  const [bullets, setBullets] = useState<BlogDetailBulletItem[]>([]);
  const [bulletTitle, setBulletTitle] = useState("");
  const [bulletText, setBulletText] = useState("");

  const [createBlogDetail, { isLoading }] = useCreateTizaraBlogDetailMutation();

  const { data: blogsData, isLoading: isBlogsLoading } = useGetAllBlogsQuery({
    limit: 200,
  });

  const blogs =
    blogsData?.data?.map((blog) => ({
      id: blog.id,
      name: blog.title,
    })) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddBlogDetailsFormValues>({
    defaultValues: {
      blog_id: defaultBlogId || "",
      heading: "",
      section_key: "",
      status: true,
    },
  });

  const blogIdValue = watch("blog_id");
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

  // ── TOC title helpers ──
  const handleAddTitle = () => {
    if (!titleInput.trim()) return;
    setTitles((prev) => [...prev, titleInput.trim()]);
    setTitleInput("");
  };

  const handleRemoveTitle = (index: number) => {
    setTitles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Bullet helpers ──
  const handleAddBullet = () => {
    if (!bulletTitle.trim() || !bulletText.trim()) {
      toast.error("Both bullet title and text are required.");
      return;
    }
    setBullets((prev) => [
      ...prev,
      { title: bulletTitle.trim(), text: bulletText.trim() },
    ]);
    setBulletTitle("");
    setBulletText("");
  };

  const handleRemoveBullet = (index: number) => {
    setBullets((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<AddBlogDetailsFormValues> = async (values) => {
    try {
      const formData = new FormData();

      formData.append("blog_id", values.blog_id);
      formData.append("heading", values.heading);

      if (values.section_key) {
        formData.append("section_key", values.section_key);
      }
      if (body) {
        formData.append("body", body);
      }
      if (titles.length > 0) {
        formData.append("titles", JSON.stringify(titles));
      }
      if (bullets.length > 0) {
        formData.append("bullets", JSON.stringify(bullets));
      }
      if (
        values.position !== undefined &&
        values.position !== null &&
        !Number.isNaN(values.position)
      ) {
        formData.append("position", String(values.position));
      }

      formData.append("status", String(values.status));

      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await createBlogDetail(formData).unwrap();
      toast.success("Blog section created successfully!");
      reset();
      setImagePreview(null);
      setBody("");
      setTitles([]);
      setBullets([]);
      router.push(ALL_BLOG_DETAILS_PATH);
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
        title="Add Blog Section"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Blog Sections", link: ALL_BLOG_DETAILS_PATH },
          { title: "Add Section" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blog Dropdown */}
          <SelectAndSearch<AddBlogDetailsFormValues>
            label="Blog Post"
            options={blogs}
            name="blog_id"
            value={blogIdValue}
            setValue={setValue}
            errors={errors}
            placeholder="Select blog post"
            required={true}
            disabled={isBlogsLoading}
          />

          {/* Section Heading */}
          <Input
            label="Section Heading"
            text="heading"
            register={register("heading", {
              required: "Section heading is required",
            })}
            errors={errors}
          />

          {/* Section Key */}
          <Input
            label="Section Key / TOC Anchor (Optional)"
            text="section_key"
            placeholder="e.g. key-features"
            register={register("section_key")}
            errors={errors}
          />

          {/* Position */}
          <Input
            label="Position (Optional)"
            text="position"
            type="number"
            placeholder="Display order"
            register={register("position", { valueAsNumber: true })}
            errors={errors}
            required={false}
          />

          {/* Status */}
          <div className="flex items-center gap-2 col-span-full">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register("status")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Active Status
            </label>
          </div>

          {/* Body */}
          <div className="col-span-full">
            <WebEditor
              label="Section Body (Optional)"
              content={body}
              setContent={setBody}
              placeholder="Write section body content..."
            />
          </div>

          {/* TOC Titles */}
          <div className="col-span-full flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              TOC Title Entries (Optional)
            </label>
            <p className="text-xs text-gray-500">
              Sub-headings shown in the table of contents for this section.
            </p>

            {titles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {titles.map((title, index) => (
                  <span
                    key={`${title}-${index}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    {title}
                    <button
                      type="button"
                      onClick={() => handleRemoveTitle(index)}
                      className="text-emerald-500 hover:text-emerald-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTitle();
                  }
                }}
                placeholder="Add a TOC title entry"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddTitle}
                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          {/* Bullets */}
          <div className="col-span-full flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              Bullet Points (Optional)
            </label>

            {bullets.length > 0 && (
              <div className="space-y-2">
                {bullets.map((bullet, index) => (
                  <div
                    key={`${bullet.title}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {bullet.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {bullet.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(index)}
                      className="text-red-500 hover:text-red-600 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-gray-200 p-3 space-y-2">
              <input
                type="text"
                value={bulletTitle}
                onChange={(e) => setBulletTitle(e.target.value)}
                placeholder="Bullet title (e.g. Real-time tracking)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddBullet();
                  }
                }}
                placeholder="Bullet description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddBullet}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={16} />
                Add Bullet
              </button>
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Section Image (Optional)
            </label>

            {imagePreview && (
              <div className="relative mb-4 h-44 w-72 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <Image
                  src={imagePreview}
                  alt="Selected section image preview"
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
            text={isLoading ? "Saving..." : "Create Section"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddBlogDetails;
