/* eslint-disable @typescript-eslint/no-explicit-any */
import { IReviewResponse, IReviewStatsResponse } from "@/interface/review";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const REVIEW_URL = "/doctor-reviews";

const doctorReviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDoctorReview: build.mutation<IGenericResponse<IReviewResponse>, any>({
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

    replyDoctorReview: build.mutation({
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

    getTargetDoctorReviews: build.query<
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
    getManagerAreaDoctorReviews: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/doctor-reviews/manager-area-reviews",
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
      { targetType?: "DOCTOR" | "DIAGNOSTIC" } | void
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

    updateDoctorReview: build.mutation({
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

    deleteDoctorReview: build.mutation({
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
  useReplyDoctorReviewMutation,

  useCreateDoctorReviewMutation,
  useGetRoleBaseReviewsQuery,
  useGetTargetDoctorReviewsQuery,
  useGetReviewStatsQuery,
  useUpdateDoctorReviewMutation,
  useDeleteDoctorReviewMutation,
  useGetManagerAreaDoctorReviewsQuery,
} = doctorReviewApi;
