/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/constant/authKey";
import {
  getFromLocalstorage,
  setToLocalstorage,
} from "@/lib/auth/local-storage";
import { getBaseUrl } from "@/lib/utils/utils";
import axios from "axios";

// Queueing variables to handle multiple 401s at once
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getFromLocalstorage(authKey);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return {
      data: response?.data?.data,
      meta: response?.data?.meta,
      stats: response?.data?.stats,
      success: response?.data?.success,
      statusCode: response?.data?.statusCode || response?.status,
    } as any;
  },
  async (error) => {
    const originalRequest = error?.config;
    if (originalRequest.url?.includes("/change-password")) {
      // শুধু error নয়, বরং ব্যাকএন্ড থেকে আসা ডাটা সহ রিজেক্ট করুন
      return Promise.reject(error.response?.data || error);
    }
    // 1. If not a 401, or if it's a request to login/refresh, reject immediately
    if (
      error?.response?.status !== 401 ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject({
        success: false,
        statusCode: error?.response?.status || 500,
        message: error?.response?.data?.message || "Something went wrong",
      });
    }

    // 2. If refresh is already in progress, add this request to a queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // 3. Start the Refresh Process
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${getBaseUrl()}/auth/refresh-token`,
        {},
        { withCredentials: true },
      );

      const newAccessToken = response?.data?.data?.accessToken;

      if (newAccessToken) {
        setToLocalstorage(authKey, newAccessToken);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }

      throw new Error("No token received");
    } catch (refreshError: any) {
      processQueue(refreshError, null);
      isRefreshing = false;

      // OPTIONAL: Logout logic here if you change your mind
      // localStorage.removeItem(authKey);

      return Promise.reject({
        success: false,
        statusCode: 401,
        message: "Session Expired",
      });
    }
  },
);
