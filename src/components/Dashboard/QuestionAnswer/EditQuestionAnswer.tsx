"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Save } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import {
  UpdateQuestionAnswerRequest,
  useGetSingleQuestionAnswerQuery,
  useUpdateQuestionAnswerMutation,
} from "@/src/redux/api/questionAnswerApi";

interface EditQuestionAnswerProps {
  id: string;
}

interface FormValues {
  question: string;
  answer: string;
}

const EditQuestionAnswer: React.FC<EditQuestionAnswerProps> = ({ id }) => {
  const router = useRouter();

  const { data, isLoading: isFetching } = useGetSingleQuestionAnswerQuery(id);
  const [updateQuestionAnswer, { isLoading }] =
    useUpdateQuestionAnswerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Load existing data into form fields
  useEffect(() => {
    if (data?.data) {
      reset({
        question: data.data.question || "",
        answer: data.data.answer || "",
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      // 1. Prepare the nested data body
      const payloadData: UpdateQuestionAnswerRequest["data"] = {
        question: values.question,
        answer: values.answer.trim() ? values.answer : undefined,
      };

      // 2. Pass { id, data } to the mutation
      await updateQuestionAnswer({
        id,
        data: payloadData,
      }).unwrap();

      toast.success("Question & Answer updated successfully!");
      router.push("/dashboard/question-answer/all-question-answer");
      router.refresh();
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Something went wrong.",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-full bg-gray-200 rounded" />
        <div className="h-24 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden p-6">
      <PageHeader
        title="Edit Question & Answer"
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/dashboard",
          },
          {
            title: "Question & Answers",
            link: "/dashboard/question-answer/all-question-answer",
          },
          {
            title: "Edit Question",
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Question Input */}
          <Input
            label="Question"
            text="question"
            register={register("question", {
              required: "Question is required",
              maxLength: {
                value: 150,
                message: "Question can contain a maximum of 150 characters.",
              },
            })}
            errors={errors}
          />

          {/* Answer Text Area */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="answer"
              className="text-sm font-medium text-gray-700"
            >
              Answer (Optional)
            </label>
            <textarea
              id="answer"
              rows={4}
              placeholder="Enter answer..."
              {...register("answer", {
                maxLength: {
                  value: 500,
                  message: "Answer can contain a maximum of 500 characters.",
                },
              })}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm transition"
            />
            {errors.answer && (
              <span className="text-xs text-red-500">
                {errors.answer.message}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 transition cursor-pointer text-sm font-medium"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isLoading ? "Updating..." : "Update Question"}
            icon={Save}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditQuestionAnswer;
