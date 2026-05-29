import { BASE_URL } from "@/constant/common";

export const getMembershipsBySlug = async (
  slug: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const url = new URL(`${BASE_URL}/membership/slug/${slug}`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch memberships. Status: ${res.status}`);
    }

    const result = await res.json();

    return {
      data: result.data,
      meta: result.meta,
    };
  } catch (error) {
    console.error("Error in getMembershipsBySlug:", error);
    return { data: [], meta: null }; // এরর হলে এম্পটি ডাটা রিটার্ন করা নিরাপদ
  }
};
