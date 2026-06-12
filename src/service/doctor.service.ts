import { BASE_URL } from "@/constant/common";
import { IDoctorResponse } from "@/interface/doctor";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllDoctors = async (query: Record<string, any>) => {
  try {
    const queryString = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, value.toString());
      }
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctors?${queryString.toString()}`,
      {
        next: {
          revalidate: 60,
          tags: ["doctors"],
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch doctors");
    }

    return res.json();
  } catch (error) {
    return { message: "Failed to fetch" };
  }
};
// services/doctorService.ts

export const getDoctorBySlug = async (
  slug: string,
  page: number = 1,
  limit: number = 10,
): Promise<IDoctorResponse | null> => {
  try {
    const url = new URL(`${BASE_URL}/doctors/${slug}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch doctor");
    }

    const result = await res.json();

    // আপনার ব্যাকএন্ড ডাটা স্ট্রাকচার অনুযায়ী রিটার্ন
    return result.data;
  } catch (error) {
    console.error("Error in getSingleDoctor:", error);
    return null;
  }
};
