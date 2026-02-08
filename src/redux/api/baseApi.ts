import { axiosBaseQuery } from "@/helper/axios/axiosBaseQuery";
import { getBaseUrl } from "@/lib/utils/utils";
import { tagTypesList } from "@/types/tagTypes";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: getBaseUrl() || "",
  }),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
