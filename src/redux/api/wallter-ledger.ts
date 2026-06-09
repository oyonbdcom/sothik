/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/types/tagTypes";

// কনস্ট্যান্ট ইউআরএল
const WALLET_URL = "/wallet-ledger";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // --- Get Ledger History (With Pagination & Filtering) ---
    getLedgerHistory: build.query({
      query: (arg: Record<string, any>) => ({
        url: WALLET_URL,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.wallet], // এখানে tagTypes.wallet ব্যবহার করবেন
    }),

    // --- Create Ledger Entry (Recharge/Debit) ---
    createLedgerEntry: build.mutation({
      query: (data) => ({
        url: WALLET_URL,
        method: "POST",
        data: data, // আপনার সার্ভিস অনুযায়ী ডাটা পাঠানো
      }),
      invalidatesTags: [tagTypes.wallet],
    }),

    // --- Update Ledger Status (Pending -> Completed/Failed) ---
    updateLedgerStatus: build.mutation({
      query: (data) => ({
        url: `${WALLET_URL}/${data.id}/status`,
        method: "PATCH",
        data: { status: data.status },
      }),
      invalidatesTags: [tagTypes.wallet],
    }),
  }),
});

// হুকস এক্সপোর্ট করা
export const {
  useGetLedgerHistoryQuery,
  useCreateLedgerEntryMutation,
  useUpdateLedgerStatusMutation,
} = walletApi;
