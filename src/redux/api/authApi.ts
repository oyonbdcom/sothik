/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
} from "@/interface/auth";
import { IUserResponse } from "@/interface/user";
import { IGenericResponse, IMeta } from "@/types";
import { tagTypes } from "@/types/tagTypes";
import { UpdateUserInput } from "@/zod-validation/user";
import { baseApi } from "../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ১. REGISTER (ইমেইল ছাড়াই এখন কাজ করবে)
    registerUser: build.mutation<
      IGenericResponse<IUserResponse>,
      IRegisterRequest
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        data,
      }),
    }),

    // ২. VERIFY OTP (নতুন ইউজার ভেরিফিকেশনের জন্য)

    verifyOtp: build.mutation<
      IGenericResponse<any>,
      { phoneNumber: string; otp: string }
    >({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // ৪. LOGIN (ফোন এবং পাসওয়ার্ড দিয়ে)
    loginUser: build.mutation<IGenericResponse<ILoginResponse>, ILoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // ৫.  send otp
    sendOtp: build.mutation<IGenericResponse<any>, { phoneNumber: string }>({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        data,
      }),
    }),

    //  RESET PASSWORD
    resetPassword: build.mutation<IGenericResponse<any>, any>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
    }),

    // ৬. GET CURRENT USER
    getCurrentUser: build.query<
      { user: IUserResponse | null; meta?: IMeta },
      void
    >({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      transformResponse: (response: any) => ({
        user: response.data,
      }),
      providesTags: [tagTypes.user],
    }),

    // ৭. UPDATE PROFILE
    updateProfile: build.mutation<
      IGenericResponse<IUserResponse>,
      Partial<UpdateUserInput>
    >({
      query: (data) => ({
        url: "/users/update-my-profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.user],
    }),

    // ৯. CHANGE PASSWORD
    changePassword: build.mutation<IGenericResponse<any>, any>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),

    // ১০. LOGOUT
    logoutUser: build.mutation<IGenericResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          console.error("Logout failed", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useSendOtpMutation,

  useResetPasswordMutation,

  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
  useChangePasswordMutation,
} = authApi;
