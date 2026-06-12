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

    createAppointmentByDiagnosticStaff: build.mutation({
      query: (data) => ({
        url: `${APPOINTMENT_URL}/staff-apt-create`,
        method: "POST",
        data,
      }),
      // We invalidate appointment tags and potentially user/patient tags
      invalidatesTags: [
        tagTypes.appointment,
        tagTypes.user,
        tagTypes.patient,
        tagTypes.staff,
      ],

      transformResponse: (response: any) => response,
    }),

    // ***************
    //     doctor dashboard appointments
    // ******************
    getDoctorDashboardAppointments: build.query({
      query: (params) => ({
        url: `${APPOINTMENT_URL}/doctor-dashboard`,
        method: "GET",
        params,
      }),

      providesTags: ["appointment"],

      transformResponse: (
        response: IGenericResponse<IAppointmentResponse[], IAppointmentStats>,
      ) => {
        return {
          appointments: response.data,
          meta: response.meta,
          stats: response.stats,
        };
      },
    }),
    getDiagnosticAppointments: build.query({
      query: (params) => ({
        url: `${APPOINTMENT_URL}/diagnostic-dashboard`,
        method: "GET",
        params,
      }),

      providesTags: ["appointment"],

      transformResponse: (
        response: IGenericResponse<IAppointmentResponse[], IAppointmentStats>,
      ) => {
        return {
          appointments: response.data,
          meta: response.meta,
          stats: response.stats,
        };
      },
    }),

    getPatientAppointments: build.query({
      query: (params) => ({
        url: `${APPOINTMENT_URL}/patient-appointments`,
        method: "GET",
        params,
      }),

      providesTags: ["appointment"],

      transformResponse: (response: any) => {
        return {
          data: response.data,
          meta: response.meta,
          queueMap: response.queueMap,
        };
      },
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

    getAreaManagerAppointments: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${APPOINTMENT_URL}/area-manager`,
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

    // coordinator dashboard
    getCoordinatorDashboard: build.query({
      query: (params) => ({
        url: "/appointments/coordinator-dashboard",
        method: "GET",
        params,
      }),

      providesTags: [tagTypes.appointment],
    }),
    getReceptionistAppointments: build.query({
      query: (params) => ({
        url: "/appointments/receptionist",
        method: "GET",
        params,
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

    requestEmergency: build.mutation({
      query: (id: string) => ({
        url: `${APPOINTMENT_URL}/${id}/request-emergency`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.appointment, tagTypes.staff],
    }),

    // ======================================================
    // REJECT EMERGENCY
    // ======================================================

    rejectEmergency: build.mutation({
      query: (id: string) => ({
        url: `${APPOINTMENT_URL}/${id}/reject-emergency`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.appointment, tagTypes.staff],
    }),
    acceptEmergency: build.mutation({
      query: (id: string) => ({
        url: `${APPOINTMENT_URL}/${id}/accept-emergency`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.appointment, tagTypes.staff],
    }),

    // ======================================================
    // COMPLETE APPOINTMENT
    // ======================================================

    completeAppointment: build.mutation({
      query: (id: string) => ({
        url: `${APPOINTMENT_URL}/${id}/complete`,
        method: "PATCH",
      }),

      invalidatesTags: [tagTypes.appointment, tagTypes.staff],
    }),
    updateDoctorSession: build.mutation({
      query: (data: any) => ({
        url: `${APPOINTMENT_URL}/update-doctor-session`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: [tagTypes.appointment],
    }),

    updateAppointment: build.mutation({
      query: (data: any) => ({
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
  useGetDoctorDashboardAppointmentsQuery,
  useGetAreaManagerAppointmentsQuery,
  useGetDiagnosticAppointmentsQuery,
  useGetReceptionistAppointmentsQuery,
  useUpdateDoctorSessionMutation,
  useRequestEmergencyMutation,
  useRejectEmergencyMutation,
  useCompleteAppointmentMutation,
  useGetPatientAppointmentsQuery,
  useCreateAppointmentByDiagnosticStaffMutation,
  useGetMyAppointmentsQuery,
  useGetCoordinatorDashboardQuery,
  useAcceptEmergencyMutation,
  useUpdateAppointmentMutation,
} = appointmentApi;
