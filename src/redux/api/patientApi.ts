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

    getSinglePatient: build.query({
      query: () => ({
        url: `${PATIENT_URL}/single`,
        method: "GET",
      }),
      // এখানে response.data সরাসরি রিটার্ন করলে টাইপ হ্যান্ডেল করা সহজ হয়
      transformResponse: (response: IGenericResponse<IPatientResponse>) => {
        return response.data; // সরাসরি পেশেন্ট অবজেক্ট রিটার্ন করা হলো
      },
      providesTags: [tagTypes.patient],
    }),
  }),
});

export const { useUpdatePatientMutation, useGetSinglePatientQuery } = patient;
