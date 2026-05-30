import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";
const STAFF_URL = "/staff";

const staffApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // CREATE STAFF
    createStaff: build.mutation({
      query: (data) => ({
        url: `${STAFF_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.staff],
    }),
    getAllStaff: build.query({
      query: () => ({
        url: `${STAFF_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.staff],
    }),
    // UPDATE STAFF
    updateStaff: build.mutation({
      query: ({ id, data }) => ({
        url: `${STAFF_URL}/${id}`,
        method: "PATCH", // Matches the PATCH method used in your backend route
        data,
      }),
      invalidatesTags: [tagTypes.staff],
    }),

    // DELETE STAFF
    deleteStaff: build.mutation({
      query: (id) => ({
        url: `${STAFF_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.staff],
    }),
  }),
});

export const {
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
