"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { ApiError } from "@/src/types/authType";
import PageHeader from "@/src/components/common/PageHeader/PageHeader";
import GradientButton from "@/src/components/common/PageHeader/GradientButton";
import Input from "@/src/components/common/Form/Input";
import {
  CreateQuestionAnswerRequest,
  useCreateQuestionAnswerMutation,
} from "@/src/redux/api/questionAnswerApi";

const AddQuestionAnswer: React.FC = () => {
  const router = useRouter();

  const [createQuestionAnswer, { isLoading }] =
    useCreateQuestionAnswerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionAnswerRequest>({
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const onSubmit: SubmitHandler<CreateQuestionAnswerRequest> = async (data) => {
    try {
      // Clean empty string optional answer to prevent unnecessary payload bloat
      const payload: CreateQuestionAnswerRequest = {
        question: data.question,
        ...(data.answer?.trim() && { answer: data.answer }),
      };

      await createQuestionAnswer(payload).unwrap();
      toast.success("Question & Answer created successfully!");
      reset();
      router.push("/dashboard/question-answers/all-question-answers");
    } catch (err) {
      const error = err as ApiError;

      Swal.fire({
        title: "Submission Failed",
        text:
          (Array.isArray(error.data?.message)
            ? error.data.message.join(", ")
            : error.data?.message) || "Failed to create question and answer.",
        icon: "error",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white border-gray-200 overflow-hidden p-6">
      <PageHeader
        title="Create Question Answer"
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
            title: "Add Question",
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

          {/* Answer Text Area / Input */}
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
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition cursor-pointer text-sm font-medium"
          >
            Cancel
          </button>

          <GradientButton
            type="submit"
            text={isLoading ? "Creating..." : "Create Question"}
            icon={Plus}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default AddQuestionAnswer;
