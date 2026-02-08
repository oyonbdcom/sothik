"use client";

import DefaultPasswordAlert from "@/components/default-password-alart";
import { useAuth } from "@/hooks/useAuth";
import { IAppointmentResponse } from "@/interface/appointment";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi"; // Adjust based on your API slice
import { Loader2 } from "lucide-react";
import { PastAppointmentCard } from "./components/past-appointment-card";

export default function MembershipDoctors() {
  const query = {
    // page,
    // ...(searchTerm && { searchTerm }),
    // ...(status !== "all" && { status }),
    // ...(date !== "" && { date }),
  };

  const { data, isLoading, isError } = useGetMyAppointmentsQuery(query);
  const { user } = useAuth();

  // 2. Handle Loading State
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 3. Handle Error State
  if (isError) {
    return <p className="text-red-500">Failed to load appointments.</p>;
  }
  const appointments = data?.appointments || [];
  return (
    <div className="space-y-4">
      {/* ডিফল্ট পাসওয়ার্ড নোটিফিকেশন ব্যানার */}
      <DefaultPasswordAlert />
      {appointments && appointments.length > 0 ? (
        appointments.map((item: IAppointmentResponse) => (
          <PastAppointmentCard key={item.id} appointment={item} />
        ))
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      )}
    </div>
  );
}
