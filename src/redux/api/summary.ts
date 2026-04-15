import { IGenericResponse } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const MANAGER_URL = "/summary";

export interface IManagerDashboardStats {
  area: string;
  stats: {
    doctors: number;
    clinics: number;
    memberships: number;
    appointments: {
      total: number;
      completed: number;
      pending: number;
    };
    reviews: number;
  };
}

const managerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getManagerDashboard: build.query<
      IGenericResponse<IManagerDashboardStats>,
      void
    >({
      query: () => ({
        url: `${MANAGER_URL}/manager`,
        method: "GET",
      }),

      providesTags: [tagTypes.manager],
    }),
  }),
});

export const { useGetManagerDashboardQuery } = managerApi;
