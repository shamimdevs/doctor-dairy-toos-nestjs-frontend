import type { ApiResponse } from "../../types/axios";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import {
  TestimonialItem,
  TestimonialPaginatedResponse,
  TestimonialQueryParams,
  UpdateTestimonialRequest,
} from "@/src/types/testimonialType";

const TESTIMONIAL_URL = "/testimonials";

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. CREATE TESTIMONIAL
    createTestimonial: builder.mutation<ApiResponse<TestimonialItem>, FormData>(
      {
        query: (formData) => ({
          url: TESTIMONIAL_URL,
          method: "POST",
          data: formData,
          contentType: true, // Enables multipart/form-data for image uploads
        }),
        invalidatesTags: [tagTypes.testimonials],
      },
    ),

    // 2. GET ALL TESTIMONIALS (Paginated & Filtered)
    getAllTestimonials: builder.query<
      TestimonialPaginatedResponse,
      TestimonialQueryParams | void
    >({
      query: (params) => ({
        url: TESTIMONIAL_URL,
        method: "GET",
        params: params || {},
      }),
      providesTags: [tagTypes.testimonials],
    }),

    // 3. GET SINGLE TESTIMONIAL BY ID
    getSingleTestimonial: builder.query<ApiResponse<TestimonialItem>, string>({
      query: (id) => ({
        url: `${TESTIMONIAL_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.testimonials],
    }),

    // 4. UPDATE TESTIMONIAL
    updateTestimonial: builder.mutation<
      ApiResponse<TestimonialItem>,
      UpdateTestimonialRequest
    >({
      query: ({ id, data }) => ({
        url: `${TESTIMONIAL_URL}/${id}`,
        method: "PATCH",
        data,
        contentType: true, // Enables multipart/form-data for image updates
      }),
      invalidatesTags: [tagTypes.testimonials],
    }),

    // 5. DELETE TESTIMONIAL
    deleteTestimonial: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${TESTIMONIAL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.testimonials],
    }),
  }),
});

// Auto-generated hooks for components
export const {
  useCreateTestimonialMutation,
  useGetAllTestimonialsQuery,
  useGetSingleTestimonialQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;
