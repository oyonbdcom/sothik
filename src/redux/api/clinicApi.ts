/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";

import {
  IClinicResponse,
  IClinicStats,
  ICreateClinicRequest,
  IUpdateClinicRequest,
} from "@/interface/clinic";
import { baseApi } from "../api/baseApi";

const CLINIC_URL = "/clinics";

const clinicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addClinic: build.mutation<
      IGenericResponse<IClinicResponse>,
      ICreateClinicRequest
    >({
      query: (data) => ({
        url: CLINIC_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.clinic],
    }),

    updateClinic: build.mutation<
      IGenericResponse<IClinicResponse>,
      { id: string; data: Partial<IUpdateClinicRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${CLINIC_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.clinic],
    }),

    getClinics: build.query<
      { clinics: IClinicResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: CLINIC_URL,
        method: "GET",
        params: arg,
      }),

      transformResponse: (response: IGenericResponse<IClinicResponse[]>) => {
        return {
          clinics: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.clinic],
    }),
    getClinicStats: build.query<{ stats: IClinicStats }, void>({
      query: () => ({
        url: `${CLINIC_URL}/statistics`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IClinicStats>) => {
        return {
          stats: response.data as IClinicStats,
        };
      },
      providesTags: [tagTypes.clinic],
    }),
    // clinicApi.ts
    getSingleClinic: build.query({
      query: (id) => ({
        url: `${CLINIC_URL}/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IClinicResponse>) => {
        return {
          clinic: response.data,
          meta: response.meta,
        };
      },
      // Fix: Add ID-specific tags
      providesTags: (result, error, id) => [{ type: tagTypes.clinic, id }],
    }),
    deleteClinic: build.mutation({
      query: (id) => ({
        url: `${CLINIC_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.clinic],
    }),
  }),
});

export const {
  useAddClinicMutation,
  useUpdateClinicMutation,
  useGetClinicStatsQuery,
  useGetClinicsQuery,
  useGetSingleClinicQuery,
  useDeleteClinicMutation,
} = clinicApi;
