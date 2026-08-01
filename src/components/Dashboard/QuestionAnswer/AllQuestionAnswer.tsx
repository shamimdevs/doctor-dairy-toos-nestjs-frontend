"use client";

import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Plus, Edit, Trash2 } from "lucide-react";

import { useDebounce } from "@/src/hooks/useDebounce";
import { ApiError } from "@/src/types/authType";
import Pagination from "@/src/utils/Pagination";
import {
  QuestionAnswer,
  useDeleteQuestionAnswerMutation,
  useGetAllQuestionAnswersQuery,
} from "@/src/redux/api/questionAnswerApi"; // Adjust path as needed

const LIMIT = 10;

const AllQuestionAnswer: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data, isLoading, isFetching } = useGetAllQuestionAnswersQuery({
    search: (debouncedSearch as string) || undefined,
    page: currentPage,
    limit: LIMIT,
  });

  const [deleteQuestionAnswer] = useDeleteQuestionAnswerMutation();

  const questions: QuestionAnswer[] = data?.data || [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search filter
  };

  const handleDelete = async (item: QuestionAnswer) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete question "${item.question}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      // Mutation auto-invalidates tagTypes.question_answer
      await deleteQuestionAnswer(item.id).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Question "${item.question}" has been deleted.`,
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      const apiError = err as ApiError;

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: apiError.data?.message || apiError.message || "Delete failed",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-3">
        {[...Array(LIMIT)].map((_, i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse rounded-md bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Question & Answers
          </h1>
          <p className="text-sm text-gray-500">
            Manage all dynamic questions and answers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <Link href="/dashboard/question-answers/add-question-answers">
            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition w-full sm:w-auto">
              <Plus size={18} />
              Add Question
            </button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Question
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Answer
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {questions?.length > 0 ? (
              questions.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-5 text-sm py-3">
                    {(currentPage - 1) * LIMIT + index + 1}
                  </td>

                  <td className="px-5 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">
                    {item.question}
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600 max-w-sm truncate">
                    {item.answer || "-"}
                  </td>

                  <td className="px-5 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-sm text-gray-600">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/dashboard/question-answers/edit-question-answers/${item.id}`}
                      >
                        <button
                          className="rounded-lg p-2 cursor-pointer text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg p-2 cursor-pointer text-red-600 hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No question & answers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {questions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalResults={totalItems}
          limit={LIMIT}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

export default AllQuestionAnswer;
