/* eslint-disable @typescript-eslint/no-explicit-any */

import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";

import {
  ICreateDiagnosticRequest,
  IDiagnosticManagerStats,
  IDiagnosticResponse,
  IUpdateDiagnosticRequest,
} from "@/interface/diagnostic";
import { baseApi } from "./baseApi";

const DIAGNOSTIC_URL = "/diagnostic";

const diagnosticApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addDiagnostic: build.mutation<
      IGenericResponse<IDiagnosticResponse>,
      ICreateDiagnosticRequest
    >({
      query: (data) => ({
        url: DIAGNOSTIC_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.diagnostic],
    }),

    getDiagnostics: build.query<
      { diagnostics: IDiagnosticResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: DIAGNOSTIC_URL,
        method: "GET",
        params: arg,
      }),

      transformResponse: (
        response: IGenericResponse<IDiagnosticResponse[]>,
      ) => {
        return {
          diagnostics: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.diagnostic],
    }),

    getAllAreaDiagnosticsName: build.query<
      { diagnostics: IDiagnosticResponse[] },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${DIAGNOSTIC_URL}/area-diagnostics-name`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: any) => {
        return {
          diagnostics: response?.data,
        };
      },
      providesTags: [tagTypes.diagnostic],
    }),
    getAllAreaDiagnostics: build.query<
      { diagnostics: IDiagnosticResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${DIAGNOSTIC_URL}/area-diagnostics`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (
        response: IGenericResponse<IDiagnosticResponse[]>,
      ) => {
        return {
          diagnostics: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.diagnostic],
    }),

    getDiagnosticManagerStats: build.query<
      { stats: IDiagnosticManagerStats },
      any
    >({
      query: (arg) => ({
        url: `${DIAGNOSTIC_URL}/statistics`,
        method: "GET",
        params: arg,
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

    getDiagnosticByIdentifier: build.query({
      query: (identifier) => ({
        url: `${DIAGNOSTIC_URL}/${identifier}`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IDiagnosticResponse>) => {
        return {
          diagnostic: response.data,
          meta: response.meta,
        };
      },
      // Fix: Add ID-specific tags
      providesTags: (result, error, id) => [{ type: tagTypes.diagnostic, id }],
    }),
    updateDiagnostic: build.mutation<
      IGenericResponse<IDiagnosticResponse>,
      { id: string; data: Partial<IUpdateDiagnosticRequest> }
    >({
      query: ({ id, data }) => ({
        url: `${DIAGNOSTIC_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.diagnostic],
    }),
    deleteDiagnostics: build.mutation({
      query: (id) => ({
        url: `${DIAGNOSTIC_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.diagnostic],
    }),
  }),
});

export const {
  useAddDiagnosticMutation,
  useGetAllAreaDiagnosticsNameQuery,
  useDeleteDiagnosticsMutation,
  useGetDiagnosticsQuery,
  useUpdateDiagnosticMutation,
  useGetAllAreaDiagnosticsQuery,
  useGetDiagnosticManagerStatsQuery,
  useGetDiagnosticByIdentifierQuery,
} = diagnosticApi;
