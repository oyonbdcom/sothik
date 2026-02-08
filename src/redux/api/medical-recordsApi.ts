import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";
const RECORDS_URL = "/medical-records";
export const medicalRecordApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createMedicalRecord: build.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.appointment, tagTypes.patient],
    }),
    updateMedicalRecord: build.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.appointment, tagTypes.patient],
    }),
  }),
});

export const {
  useUpdateMedicalRecordMutation,
  useCreateMedicalRecordMutation,
} = medicalRecordApi;
