/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IMembershipResponse,
  UpdateMembershipInput,
} from "@/interface/diagnostic-membership";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { baseApi } from "../api/baseApi";

const MEMBERSHIP_URL = "/membership";

const memberShipApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. Create a new Membership
    createMembership: build.mutation<IGenericResponse<any>, any>({
      query: (data) => ({
        url: MEMBERSHIP_URL,
        method: "POST",
        data,
      }),
      invalidatesTags: [
        tagTypes.membership,
        tagTypes.doctor,
        tagTypes.diagnostic,
      ],
    }),

    // 2. Get All Memberships (Filtering & Pagination)
    getDiagnosticDoctors: build.query<
      { membership: any[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${MEMBERSHIP_URL}/slug/${arg?.slug}`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IGenericResponse<any[]>) => {
        return {
          membership: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.membership],
    }),

    // ***************
    //     doctor dashboard diagnostics name for filter
    // ******************
    getDoctorDiagnosticsName: build.query({
      query: () => ({
        url: `${MEMBERSHIP_URL}/doctor-diagnostics-name`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, slug) => [
        { type: tagTypes.membership, id: slug },
      ],
    }),
    getMembershipById: build.query<
      { memberships: IMembershipResponse[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: `${MEMBERSHIP_URL}/diagnostic`,
        method: "GET",
        // যদি arg থাকে তবে সেটি params এ যাবে, নাহলে undefined
        params: arg || {},
      }),
      transformResponse: (
        response: IGenericResponse<IMembershipResponse[]>,
      ) => {
        return {
          memberships: response?.data || [], // response না থাকলে খালি অ্যারে
          meta: response?.meta,
        };
      },
      providesTags: [tagTypes.membership],
    }),

    // 4. Update Membership Status
    updateMembership: build.mutation<
      IGenericResponse<IMembershipResponse>,
      { id: string; data: Partial<UpdateMembershipInput> }
    >({
      query: ({ id, data }) => ({
        url: `${MEMBERSHIP_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.membership, id },
        tagTypes.membership,
        tagTypes.doctor,
        tagTypes.diagnostic,
      ],
    }),

    // 5. Delete Membership
    deleteMembership: build.mutation<any, string>({
      query: (id) => ({
        url: `${MEMBERSHIP_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        tagTypes.membership,
        tagTypes.doctor,
        tagTypes.diagnostic,
      ],
    }),
  }),
});

export const {
  useCreateMembershipMutation,
  useGetDiagnosticDoctorsQuery,
  useGetDoctorDiagnosticsNameQuery,
  useGetMembershipByIdQuery,
  useUpdateMembershipMutation,

  useDeleteMembershipMutation,
} = memberShipApi;
