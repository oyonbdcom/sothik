/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";

import {
  IPatientResponse,
  IPatientStats,
  IUpdatePatientRequest,
} from "@/interface/patient";
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

    getPatients: build.query<
      { patients: IPatientResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: PATIENT_URL,
        method: "GET",
        params: arg,
      }),

      transformResponse: (response: IGenericResponse<IPatientResponse[]>) => {
        return {
          patients: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.patient],
    }),
    getPatientStats: build.query<{ stats: IPatientStats }, void>({
      query: () => ({
        url: `${PATIENT_URL}/statistics`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IPatientStats>) => {
        return {
          stats: response.data as IPatientStats,
        };
      },
      providesTags: [tagTypes.patient],
    }),
    getSinglePatient: build.query({
      query: (id) => ({
        url: `${PATIENT_URL}/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IPatientResponse>) => {
        return {
          patient: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.patient],
    }),
    deletePatient: build.mutation({
      query: (id) => ({
        url: `${PATIENT_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.patient],
    }),
  }),
});

export const {
  useUpdatePatientMutation,
  useGetPatientsQuery,
  useGetPatientStatsQuery,
  useGetSinglePatientQuery,
  useDeletePatientMutation,
} = patient;
