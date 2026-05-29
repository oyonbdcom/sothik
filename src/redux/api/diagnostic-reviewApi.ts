/* eslint-disable @typescript-eslint/no-explicit-any */
import { IReviewResponse } from "@/interface/review";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "./baseApi";

const REVIEW_URL = "/diagnostic-reviews";

const diagnosticReviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDiagnosticReview: build.mutation<
      IGenericResponse<IReviewResponse>,
      any
    >({
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

    replyDiagnosticReview: build.mutation({
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

    getTargetDiagnosticReviews: build.query<
      { reviews: any[]; meta: IMeta | undefined },
      { diagnosticId: string; [key: string]: any }
    >({
      query: ({ diagnosticId, ...params }) => ({
        url: `${REVIEW_URL}/${diagnosticId}`,
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

    // getReviewStats: build.query<
    //   { stats: any },
    //   { targetType?: "DOCTOR" | "DIAGNOSTIC" } | void
    // >({
    //   query: (arg) => ({
    //     url: `${REVIEW_URL}/statistics`,
    //     method: "GET",
    //     params: arg,
    //   }),
    //   transformResponse: (response: IGenericResponse<IReviewStatsResponse>) => {
    //     return {
    //       stats: response?.stats,
    //     };
    //   },
    //   providesTags: [tagTypes.review],
    // }),

    updateDiagnosticReview: build.mutation({
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

    deleteDiagnosticReview: build.mutation({
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
  useReplyDiagnosticReviewMutation,

  useCreateDiagnosticReviewMutation,

  useGetTargetDiagnosticReviewsQuery,

  useUpdateDiagnosticReviewMutation,
  useDeleteDiagnosticReviewMutation,
} = diagnosticReviewApi;
