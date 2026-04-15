/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DoctorPagination.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AppPagination from "./app-pagination";

export default function ServerPagination({ meta }: { meta: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    // ১. বর্তমান URL-এর সব প্যারামিটার কপি করা
    const params = new URLSearchParams(searchParams.toString());

    // ২. শুধু 'page' কি-টি আপডেট করা
    params.set("page", page.toString());

    // ৩. নতুন URL-এ পুশ করা
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  return <AppPagination meta={meta} onPageChange={handlePageChange} />;
}
