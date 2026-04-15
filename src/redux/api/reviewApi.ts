/* eslint-disable @typescript-eslint/no-explicit-any */
import { IReviewResponse, IReviewStatsResponse } from "@/interface/review";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const REVIEW_URL = "/reviews";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReview: build.mutation<IGenericResponse<IReviewResponse>, any>({
      query: (data) => ({
        url: REVIEW_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, { id, data }) => [
        tagTypes.review,
        tagTypes.doctor,

        { type: tagTypes.doctor, id: data?.doctorId },
      ],
    }),
    replyReview: build.mutation({
      query: ({ id, content }) => ({
        url: `${REVIEW_URL}/${id}/reply`,
        method: "POST",
        data: { content },
      }),
      invalidatesTags: (result, error, arg) => [
        tagTypes.review,

        { type: tagTypes.review, id: arg.id },
      ],
    }),
    getRoleBaseReviews: build.query<
      { reviews: any[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: REVIEW_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IGenericResponse<IReviewResponse[]>) => {
        return {
          reviews: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.review],
    }),

    getTargetReviews: build.query<
      { reviews: any[]; meta: IMeta | undefined },
      { doctorId: string; [key: string]: any }
    >({
      query: ({ doctorId, ...params }) => ({
        url: `${REVIEW_URL}/${doctorId}`,
        method: "GET",

        params: { ...params },
      }),
      transformResponse: (response: IGenericResponse<IReviewResponse[]>) => {
        return {
          reviews: response?.data || [],
          meta: response?.meta,
        };
      },
      providesTags: [tagTypes.review, tagTypes.doctor],
    }),
    getManagerAreaReviews: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/reviews/manager-area-reviews",
        method: "GET",
        params: arg, // এখানে searchTerm, page, limit, rating, status ইত্যাদি পাস হবে
      }),
      transformResponse: (response: IGenericResponse<IReviewResponse[]>) => {
        return {
          reviews: response?.data || [],
          meta: response?.meta,
        };
      },
      providesTags: [tagTypes.review],
    }),
    getReviewStats: build.query<
      { stats: any },
      { targetType?: "DOCTOR" | "CLINIC" } | void
    >({
      query: (arg) => ({
        url: `${REVIEW_URL}/statistics`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IGenericResponse<IReviewStatsResponse>) => {
        return {
          stats: response?.stats,
        };
      },
      providesTags: [tagTypes.review],
    }),

    updateReview: build.mutation({
      query: ({ id, data }) => ({
        url: `${REVIEW_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id, data }) => [
        tagTypes.review,
        tagTypes.doctor,

        { type: tagTypes.doctor, id: data?.doctorId },
      ],
    }),

    deleteReview: build.mutation({
      query: (id) => ({
        url: `${REVIEW_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id, data }) => [
        tagTypes.review,
        tagTypes.doctor,

        { type: tagTypes.doctor, id: data?.doctorId },
      ],
    }),
  }),
});

export const {
  useReplyReviewMutation,
  useCreateReviewMutation,
  useGetRoleBaseReviewsQuery,
  useGetTargetReviewsQuery,
  useGetReviewStatsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetManagerAreaReviewsQuery,
} = reviewApi;
