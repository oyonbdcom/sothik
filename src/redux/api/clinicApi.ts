/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";

import {
  IClinicResponse,
  ICreateClinicRequest,
  IDiagnosticManagerStats,
  IUpdateClinicRequest,
} from "@/interface/clinic";
import { baseApi } from "../api/baseApi";

const DIAGNOSTIC_URL = "/diagnostic";

const clinicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addClinic: build.mutation<
      IGenericResponse<IClinicResponse>,
      ICreateClinicRequest
    >({
      query: (data) => ({
        url: DIAGNOSTIC_URL,
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
        url: `${DIAGNOSTIC_URL}/${id}`,
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
        url: DIAGNOSTIC_URL,
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
    getAllAreaClinics: build.query<
      { clinics: IClinicResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${DIAGNOSTIC_URL}/area-diagnostic`,
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

    getDiagnosticManagerStats: build.query<
      { stats: IDiagnosticManagerStats },
      void
    >({
      query: () => ({
        url: `${DIAGNOSTIC_URL}/statistics`,
        method: "GET",
      }),
      transformResponse: (
        response: IGenericResponse<IDiagnosticManagerStats>,
      ) => {
        return {
          stats: response.data as IDiagnosticManagerStats,
        };
      },
      providesTags: [tagTypes.staff],
    }),
    // clinicApi.ts
    getSingleClinic: build.query({
      query: () => ({
        url: `${DIAGNOSTIC_URL}/single`,
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
        url: `${DIAGNOSTIC_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.clinic],
    }),
  }),
});

export const {
  useAddClinicMutation,
  useUpdateClinicMutation,
  useGetDiagnosticManagerStatsQuery,
  useGetClinicsQuery,

  useGetAllAreaClinicsQuery,
  useGetSingleClinicQuery,
  useDeleteClinicMutation,
} = clinicApi;
