import { BASE_URL } from "@/constant/common";
import { tagTypes } from "@/types/tagTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAllDiagnostics = async (query: Record<string, any>) => {
  try {
    const queryString = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, value.toString());
      }
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/diagnostic?${queryString.toString()}`,
      {
        next: {
          revalidate: 60,
          tags: [tagTypes.diagnostic],
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch diagnostic");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return { message: "Failed to fetch" };
  }
};
// services/doctorService.ts

export const getDiagnosticByIdentifier = async (identifier: string) => {
  try {
    const res = await fetch(`${BASE_URL}/diagnostic/${identifier}`, {
      cache: "no-store",
    });

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("Error in getSingleDoctor:", error);
    return null;
  }
};
