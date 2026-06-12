/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericResponse } from "@/types";
import { tagTypes } from "@/types/tagTypes";

import { IPatientResponse, IUpdatePatientRequest } from "@/interface/patient";
import { baseApi } from "../api/baseApi";

const PATIENT_URL = "/patient";

const patient = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updatePatient: build.mutation<
      IGenericResponse<IPatientResponse>,
      { id: string; data: Partial<IUpdatePatientRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${PATIENT_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.patient],
    }),

    getPatientById: build.query({
      query: () => ({
        url: `${PATIENT_URL}/me`,
        method: "GET",
      }),
      // এখানে response.data সরাসরি রিটার্ন করলে টাইপ হ্যান্ডেল করা সহজ হয়
      transformResponse: (response: any) => {
        return response.data;
      },
      providesTags: [tagTypes.patient],
    }),
  }),
});

export const { useUpdatePatientMutation, useGetPatientByIdQuery } = patient;
