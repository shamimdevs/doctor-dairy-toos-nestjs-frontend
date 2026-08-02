"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";

interface ProductGalleryUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
  maxCount?: number;
}

const ProductGalleryUploader: React.FC<ProductGalleryUploaderProps> = ({
  files,
  onFilesChange,
  existingImages = [],
  maxCount = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const remainingSlots = maxCount - files.length;
    if (remainingSlots <= 0) {
      toast.error(`You can upload a maximum of ${maxCount} gallery images.`);
      e.target.value = "";
      return;
    }

    const accepted = selected.slice(0, remainingSlots);
    if (selected.length > remainingSlots) {
      toast.error(
        `Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} can be added (max ${maxCount}).`,
      );
    }

    onFilesChange([...files, ...accepted]);
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition">
      <div className="flex items-center justify-between mb-2">
        <label className="font-semibold text-sm text-gray-700">
          Gallery Images (Optional, up to {maxCount})
        </label>
        <span className="text-xs text-gray-400">
          {files.length}/{maxCount} selected
        </span>
      </div>

      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">
            Current gallery images
            {files.length > 0
              ? " — replaced by the new images you just selected below."
              : " — select new images to replace the entire gallery."}
          </p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div
                key={img}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <Image
                  src={img}
                  alt="Existing gallery image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {previews.map((src, index) => (
            <div
              key={src}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-emerald-300 bg-gray-50"
            >
              <Image
                src={src}
                alt={`Selected gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                aria-label={`Remove image ${index + 1}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={files.length >= maxCount}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
      >
        <ImagePlus size={16} />
        Add Images
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProductGalleryUploader;
