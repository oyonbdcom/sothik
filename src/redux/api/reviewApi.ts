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
      invalidatesTags: (result, error, arg) => [
        tagTypes.review,
        tagTypes.clinic,
        tagTypes.doctor,

        { type: tagTypes.doctor, id: arg.targetId },
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
      { targetId: string; targetType: "DOCTOR" | "CLINIC"; [key: string]: any }
    >({
      query: ({ targetId, targetType, ...params }) => ({
        url: `${REVIEW_URL}/${targetId}`,
        method: "GET",

        params: { targetType, ...params },
      }),
      transformResponse: (response: IGenericResponse<IReviewResponse[]>) => {
        return {
          reviews: response?.data || [],
          meta: response?.meta,
        };
      },
      providesTags: [tagTypes.review, tagTypes.doctor],
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
      invalidatesTags: (result, error, arg) => [
        tagTypes.review,
        tagTypes.doctor,
        tagTypes.clinic,

        { type: tagTypes.doctor, id: arg.data.targetId },
      ],
    }),

    deleteReview: build.mutation({
      query: (id) => ({
        url: `${REVIEW_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.review],
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
} = reviewApi;
