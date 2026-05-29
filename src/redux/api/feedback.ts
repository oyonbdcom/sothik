/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFeedbackResponse } from "@/interface/review";
import { IGenericResponse } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";
const FEEDBACK_URL = "/feedbacks";
const feedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFeedback: build.mutation<IGenericResponse<IFeedbackResponse>, any>({
      query: (data) => ({
        url: `${FEEDBACK_URL}`,
        method: "POST",
        data,
      }),

      invalidatesTags: (result) => [tagTypes.feedback],
    }),

    getFeedbacks: build.query({
      query: () => ({
        url: `${FEEDBACK_URL}`,
        method: "GET",
      }),
      providesTags: ["Feedback"],
    }),
  }),
});

export const { useCreateFeedbackMutation, useGetFeedbacksQuery } = feedbackApi;
