/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IMembershipResponse,
  UpdateMembershipInput,
} from "@/interface/clinic-membership";
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
      invalidatesTags: [tagTypes.membership, tagTypes.doctor, tagTypes.clinic],
    }),

    // 2. Get All Memberships (Filtering & Pagination)
    getMemberships: build.query<
      { membership: any[]; meta: IMeta | undefined },
      Record<string, any> | void
    >({
      query: (arg) => ({
        url: MEMBERSHIP_URL,
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
    getMyDoctors: build.query<any[], void>({
      query: () => ({
        url: `${MEMBERSHIP_URL}/my-doctors`,
        method: "GET",
      }),
      transformResponse: (response: IGenericResponse<any[]>) => response.data,
      providesTags: [tagTypes.membership, tagTypes.doctor],
    }),
    // 3. Get Single Membership By ID
    getMembershipById: build.query<any, { targetId: string; params?: any }>({
      query: ({ targetId, params }) => ({
        url: `${MEMBERSHIP_URL}/${targetId}`,
        method: "GET",
        params,
      }),
      transformResponse: (response: IGenericResponse<any>) => response.data,
      providesTags: (result, error, { targetId }) => [
        { type: tagTypes.membership, id: targetId },
      ],
    }),

    // 4. Update Membership Status
    updateMembership: build.mutation<
      IGenericResponse<IMembershipResponse>,
      { id: string; data: Partial<UpdateMembershipInput> }
    >({
      query: ({ id, data }) => ({
        url: `${MEMBERSHIP_URL}/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: tagTypes.membership, id },
        tagTypes.membership,
        tagTypes.doctor,
        tagTypes.clinic,
      ],
    }),

    // 5. Delete Membership
    deleteMembership: build.mutation<any, string>({
      query: (id) => ({
        url: `${MEMBERSHIP_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.membership, tagTypes.doctor, tagTypes.clinic],
    }),
  }),
});

export const {
  useCreateMembershipMutation,
  useGetMembershipsQuery,
  useGetMembershipByIdQuery,
  useUpdateMembershipMutation,
  useGetMyDoctorsQuery,
  useDeleteMembershipMutation,
} = memberShipApi;
