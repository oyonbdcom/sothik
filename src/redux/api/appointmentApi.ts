/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IAppointmentResponse,
  IAppointmentStats,
} from "@/interface/appointment";
import { IGenericResponse } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const APPOINTMENT_URL = "/appointments";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Appointment (Handles Guest & Auth)
    createAppointment: build.mutation({
      query: (data) => ({
        url: `${APPOINTMENT_URL}`,
        method: "POST",
        data,
      }),
      // We invalidate appointment tags and potentially user/patient tags
      invalidatesTags: [tagTypes.appointment, tagTypes.user, tagTypes.patient],

      // Optional: Transform response to handle auto-login logic in the component
      transformResponse: (response: any) => response,
    }),

    createAppointmentForAdmin: build.mutation({
      query: (data) => ({
        url: `${APPOINTMENT_URL}/admin`,
        method: "POST",
        data,
      }),
      // We invalidate appointment tags and potentially user/patient tags
      invalidatesTags: [tagTypes.appointment, tagTypes.user, tagTypes.patient],

      // Optional: Transform response to handle auto-login logic in the component
      transformResponse: (response: any) => response,
    }),

    getMyAppointments: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${APPOINTMENT_URL}`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (
        response: IGenericResponse<IAppointmentResponse[], IAppointmentStats>,
      ) => {
        return {
          appointments: response.data,
          meta: response.meta,
          stats: response.stats,
        };
      },
      providesTags: [tagTypes.appointment],
    }),

    getManagerAreaAppointments: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/appointments/manager-appointments",
        method: "GET",
        params: arg,
      }),
      providesTags: ["appointment"],
    }),

    exportDoctorDailyPdf: build.query({
      query: (params: { doctorId: string; date: string; status: string }) => ({
        url: `${APPOINTMENT_URL}/export`,
        method: "GET",
        params,
        responseHandler: async (response: { blob: () => any }) => {
          const blob = await response.blob();
          return blob;
        },
      }),
      providesTags: [tagTypes.appointment],
    }),

    updateAppointment: build.mutation({
      query: (data: {
        id: string;
        times: string | undefined;
        status: string;
        serialNumber: number;
      }) => ({
        url: `${APPOINTMENT_URL}/${data.id}`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: [tagTypes.appointment],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetManagerAreaAppointmentsQuery,
  useCreateAppointmentForAdminMutation,
  useGetMyAppointmentsQuery,
  useExportDoctorDailyPdfQuery,
  useUpdateAppointmentMutation,
} = appointmentApi;
