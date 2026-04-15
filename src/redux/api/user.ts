/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const USER_URL = "/users";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // --- Get All Users with Search & Filtering ---
    getUsers: build.query<
      { users: any[]; meta: IMeta | undefined },
      Record<string, any> | undefined
    >({
      query: (arg) => ({
        url: USER_URL,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          users: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.user],
    }),
    getManagers: build.query<
      { managers: any[]; meta: IMeta | undefined },
      Record<string, any> | undefined
    >({
      query: (arg) => ({
        url: `${USER_URL}/managers`, // আমাদের নতুন ব্যাকএন্ড রাউট
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          managers: response.data, // এখানে ডাটাবেস থেকে আসা পরিসংখ্যান (Count) সহ ডাটা থাকবে
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.user],
    }),
    // --- Get Single User ---
    getSingleUser: build.query({
      query: (id: string) => ({
        url: `${USER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),

    // --- Update User Role & Manager Assignment ---
    updateUserRole: build.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-role/${data.id}`,
        method: "PATCH",

        data: data,
      }),

      invalidatesTags: [tagTypes.user],
    }),

    // --- General Profile Update ---
    updateProfile: build.mutation({
      query: (data) => ({
        url: `${USER_URL}/update-profile`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    // --- Delete User (Admin Only) ---
    deleteUser: build.mutation({
      query: (id: string) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetManagersQuery,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserRoleMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = userApi;
