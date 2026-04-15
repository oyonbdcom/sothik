/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const SETUP_URL = "/setup";

export const setupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // --- District Endpoints ---
    addDistrict: build.mutation({
      query: (data) => ({
        url: `${SETUP_URL}/districts`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.district],
    }),

    getDistricts: build.query<
      { districts: any[]; meta: IMeta | undefined },
      void
    >({
      query: () => ({
        url: `${SETUP_URL}/districts`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          districts: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.district],
    }),

    updateDistrict: build.mutation({
      query: ({ id, data }) => ({
        url: `${SETUP_URL}/districts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.district],
    }),

    deleteDistrict: build.mutation({
      query: (id) => ({
        url: `${SETUP_URL}/districts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.district],
    }),

    // --- Area Endpoints ---
    addArea: build.mutation({
      query: (data) => ({
        url: `${SETUP_URL}/areas`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.area],
    }),

    // build.query এর দ্বিতীয় প্যারামিটার void থেকে string করে দিন
    getAreas: build.query<
      { areas: any[]; meta: IMeta | undefined },
      string | Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${SETUP_URL}/areas`,
        method: "GET",

        params: typeof arg === "string" ? { district: arg } : arg,
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          areas: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.area],
    }),

    updateArea: build.mutation({
      query: ({ id, data }) => ({
        url: `${SETUP_URL}/areas/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.area],
    }),

    deleteArea: build.mutation({
      query: (id) => ({
        url: `${SETUP_URL}/areas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.area],
    }),

    // --- Department Endpoints ---
    addDepartment: build.mutation({
      query: (data) => ({
        url: `${SETUP_URL}/departments`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.department],
    }),

    getDepartments: build.query<
      { departments: any[]; meta: IMeta | undefined },
      void
    >({
      query: () => ({
        url: `${SETUP_URL}/departments`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          departments: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.department],
    }),

    updateDepartment: build.mutation({
      query: ({ id, data }) => ({
        url: `${SETUP_URL}/departments/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.department],
    }),

    deleteDepartment: build.mutation({
      query: (id) => ({
        url: `${SETUP_URL}/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.department],
    }),
  }),
});

export const {
  useAddDistrictMutation,
  useGetDistrictsQuery,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useAddAreaMutation,
  useGetAreasQuery,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
  useAddDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = setupApi;
