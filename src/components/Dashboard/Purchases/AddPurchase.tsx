"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus, ArrowLeft, Upload } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

import { ApiError } from "@/src/types/authType";
import { PurchaseStatus } from "@/src/types/purchaseType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import { useCreatePurchaseMutation } from "@/src/redux/api/purchaseApi";

interface AddPurchaseFormValues {
  product_name: string;
  quantity: number;
  unit_price: number;
  supplier_name: string;
  supplier_phone?: string;
  supplier_email?: string;
  supplier_address?: string;
  purchase_date: string;
  status: PurchaseStatus;
  notes?: string;
  image?: FileList;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const AddPurchase = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddPurchaseFormValues>({
    defaultValues: {
      purchase_date: todayISO(),
      status: "pending",
    },
  });

  const quantity = Number(watch("quantity")) || 0;
  const unitPrice = Number(watch("unit_price")) || 0;
  const totalAmount = useMemo(
    () => (quantity * unitPrice).toFixed(2),
    [quantity, unitPrice],
  );

  const imagePreview = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onSubmit: SubmitHandler<AddPurchaseFormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("product_name", values.product_name);
      formData.append("quantity", String(values.quantity));
      formData.append("unit_price", String(values.unit_price));
      formData.append("supplier_name", values.supplier_name);
      formData.append("purchase_date", values.purchase_date);
      formData.append("status", values.status);

      if (values.supplier_phone?.trim()) {
        formData.append("supplier_phone", values.supplier_phone.trim());
      }
      if (values.supplier_email?.trim()) {
        formData.append("supplier_email", values.supplier_email.trim());
      }
      if (values.supplier_address?.trim()) {
        formData.append("supplier_address", values.supplier_address.trim());
      }
      if (values.notes?.trim()) {
        formData.append("notes", values.notes.trim());
      }
      if (values.image?.[0]) {
        formData.append("image", values.image[0]);
      }

      await createPurchase(formData).unwrap();
      toast.success("Purchase recorded successfully!");
      router.push("/dashboard/purchases/all-purchases");
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
        title="Add Purchase"
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard" },
          { title: "Purchases", link: "/dashboard/purchases/all-purchases" },
          { title: "Add Purchase" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            text="product_name"
            placeholder="e.g. Napa Extra"
            register={register("product_name", {
              required: "Product name is required",
            })}
            errors={errors}
          />

          <Input
            label="Quantity"
            text="quantity"
            type="number"
            placeholder="e.g. 100"
            register={register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true,
              min: { value: 1, message: "Quantity must be at least 1" },
            })}
            errors={errors}
          />

          <Input
            label="Unit Price"
            text="unit_price"
            type="number"
            placeholder="e.g. 12.50"
            register={register("unit_price", {
              required: "Unit price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Unit price cannot be negative" },
            })}
            errors={errors}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Total Amount
            </label>
            <input
              type="text"
              readOnly
              value={totalAmount}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-600 opacity-80 cursor-not-allowed"
            />
          </div>

          <Input
            label="Supplier Name"
            text="supplier_name"
            placeholder="e.g. ABC Pharmaceuticals Ltd."
            register={register("supplier_name", {
              required: "Supplier name is required",
            })}
            errors={errors}
          />

          <Input
            label="Supplier Phone (Optional)"
            text="supplier_phone"
            placeholder="e.g. +8801700000000"
            register={register("supplier_phone")}
            errors={errors}
            required={false}
          />

          <Input
            label="Supplier Email (Optional)"
            text="supplier_email"
            placeholder="e.g. supplier@example.com"
            register={register("supplier_email")}
            errors={errors}
            required={false}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Date <span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("purchase_date", {
                required: "Purchase date is required",
              })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            {errors.purchase_date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.purchase_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("status", { required: true })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">
              Supplier Address (Optional)
            </label>
            <textarea
              {...register("supplier_address")}
              rows={2}
              placeholder="e.g. 123 Supplier Road, Dhaka"
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="e.g. Paid via bank transfer."
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          {/* Product Image Upload & Preview */}
          <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-emerald-500 transition bg-gray-50/50">
            <label className="block mb-2 font-semibold text-sm text-gray-700">
              Product Image (Optional)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {imagePreview ? (
                <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shrink-0">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
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
                  JPG, PNG, GIF, WEBP (max 5MB).
                </p>
              </div>
            </div>
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
            text={isLoading ? "Saving..." : "Create Purchase"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
