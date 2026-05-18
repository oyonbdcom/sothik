import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const STAFF_URL = "/staff";

const staffApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createStaff: build.mutation({
      query: (data) => ({
        url: `${STAFF_URL}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.staff],
    }),
  }),
});

export const { useCreateStaffMutation } = staffApi;
