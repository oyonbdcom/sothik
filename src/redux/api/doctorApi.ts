/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDoctorResponse, IDoctorStats } from "@/interface/doctor";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { CreateDoctorInput, UpdateDoctorInput } from "@/zod-validation/doctor";
import { baseApi } from "../api/baseApi";

const DOCTOR_URL = "/doctors";

const doctorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addDoctor: build.mutation<
      IGenericResponse<IDoctorResponse>,
      CreateDoctorInput
    >({
      query: (data) => ({
        url: DOCTOR_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.doctor],
    }),

    updateDoctor: build.mutation<
      IGenericResponse<IDoctorResponse>,
      { id: string; data: Partial<UpdateDoctorInput> }
    >({
      query: ({ id, data }) => ({
        url: `${DOCTOR_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.doctor],
    }),

    getDoctors: build.query<
      { doctors: IDoctorResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: DOCTOR_URL,
        method: "GET",
        params: arg,
      }),

      transformResponse: (response: IGenericResponse<IDoctorResponse[]>) => {
        return {
          doctors: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.doctor],
    }),
    getDoctorStats: build.query<{ stats: IDoctorStats }, void>({
      query: () => ({
        url: `${DOCTOR_URL}/statistics`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IDoctorStats>) => {
        return {
          stats: response.data as IDoctorStats,
        };
      },
      providesTags: [tagTypes.doctor],
    }),
    getSingleDoctor: build.query({
      query: (id) => ({
        url: `${DOCTOR_URL}/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<IDoctorResponse>) => {
        return {
          doctor: response.data,
          meta: response.meta,
        };
      },
      providesTags: (result, error, id) => [{ type: tagTypes.doctor, id }],
    }),
    deleteDoctor: build.mutation({
      query: (id) => ({
        url: `${DOCTOR_URL}/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: [tagTypes.doctor],
    }),
  }),
});

export const {
  useAddDoctorMutation,
  useGetDoctorStatsQuery,
  useUpdateDoctorMutation,
  useGetDoctorsQuery,
  useGetSingleDoctorQuery,
  useDeleteDoctorMutation,
} = doctorApi;
