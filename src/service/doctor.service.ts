import { BASE_URL } from "@/constant/common";

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

export const getSingleDoctor = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/doctors/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch doctor");
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.log("Error in getSingleDoctor:", error);
    return null;
  }
};
