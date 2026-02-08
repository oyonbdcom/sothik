/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axiosInstance";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      contentType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, contentType }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(contentType
            ? { "Content-Type": contentType }
            : { "Content-Type": "application/json" }),
        },
        withCredentials: true,
      });
      console.log(result);
      return { data: result };
    } catch (axiosError) {
      const err = axiosError as any;
      return {
        error: {
          statusCode: err.statusCode || err.response?.status,
          message: err.message || err.response?.data,
        },
      };
    }
  };
