"use client";

import { UserRole } from "@/constant/common";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CoordinatorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (
      user.role !== UserRole.STAFF ||
      user.staff?.staffType !== "COORDINATOR"
    ) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (!user) return null;

  return <>{children}</>;
}
