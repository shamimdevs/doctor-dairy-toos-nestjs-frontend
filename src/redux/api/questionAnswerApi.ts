import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import type { ApiResponse } from "../../types/axios";

// ------------------------------------------------------------------
// TYPES & INTERFACES
// ------------------------------------------------------------------

export interface QuestionAnswer {
  id: string;
  question: string;
  answer?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateQuestionAnswerRequest {
  question: string;
  answer?: string;
}

export interface UpdateQuestionAnswerRequest {
  id: string;
  data: Partial<CreateQuestionAnswerRequest> & { is_active?: boolean };
}

export interface GetQuestionAnswersQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface QuestionAnswersPaginatedResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: QuestionAnswer[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ------------------------------------------------------------------
// RTK QUERY SLICE
// ------------------------------------------------------------------

const QUESTION_ANSWERS_PATH = "/question-answers";

export const questionAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------------------------------------------------
    // CREATE QUESTION ANSWER
    // ------------------------------------------------------------------
    createQuestionAnswer: builder.mutation<
      ApiResponse<QuestionAnswer>,
      CreateQuestionAnswerRequest
    >({
      query: (data) => ({
        url: QUESTION_ANSWERS_PATH,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.question_answers],
    }),

    // ------------------------------------------------------------------
    // GET ALL QUESTION ANSWERS (With Pagination & Filters)
    // ------------------------------------------------------------------
    getAllQuestionAnswers: builder.query<
      QuestionAnswersPaginatedResponse,
      GetQuestionAnswersQuery | void
    >({
      query: (params) => ({
        url: QUESTION_ANSWERS_PATH,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.question_answers],
    }),

    // ------------------------------------------------------------------
    // GET SINGLE QUESTION ANSWER BY ID
    // ------------------------------------------------------------------
    getSingleQuestionAnswer: builder.query<ApiResponse<QuestionAnswer>, string>(
      {
        query: (id) => ({
          url: `${QUESTION_ANSWERS_PATH}/${id}`,
          method: "GET",
        }),
        providesTags: [tagTypes.question_answers],
      },
    ),

    // ------------------------------------------------------------------
    // UPDATE QUESTION ANSWER
    // ------------------------------------------------------------------
    updateQuestionAnswer: builder.mutation<
      ApiResponse<QuestionAnswer>,
      UpdateQuestionAnswerRequest
    >({
      query: ({ id, data }) => ({
        url: `${QUESTION_ANSWERS_PATH}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.question_answers],
    }),

    // ------------------------------------------------------------------
    // DELETE QUESTION ANSWER
    // ------------------------------------------------------------------
    deleteQuestionAnswer: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${QUESTION_ANSWERS_PATH}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.question_answers],
    }),
  }),
});

export const {
  useCreateQuestionAnswerMutation,
  useGetAllQuestionAnswersQuery,
  useGetSingleQuestionAnswerQuery,
  useUpdateQuestionAnswerMutation,
  useDeleteQuestionAnswerMutation,
} = questionAnswerApi;
