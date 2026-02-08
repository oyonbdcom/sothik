/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericResponse } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const SCHEDULE_URL = "/schedule";

const scheduleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSchedule: build.mutation<IGenericResponse<any>, any>({
      query: (data) => ({
        url: SCHEDULE_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.membership, tagTypes.clinic],
    }),

    updateSchedule: build.mutation({
      query: ({ id, data }) => ({
        url: `${SCHEDULE_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.membership, tagTypes.clinic],
    }),

    // 5. Delete schedule
    deleteSchedule: build.mutation({
      query: (id) => ({
        url: `${SCHEDULE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.membership, tagTypes.clinic],
    }),
  }),
});

export const {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;
