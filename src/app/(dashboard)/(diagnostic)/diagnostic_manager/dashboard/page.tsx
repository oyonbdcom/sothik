/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2, Stethoscope, Users } from "lucide-react";

import { useGetDiagnosticManagerStatsQuery } from "@/redux/api/clinicApi";
import AddStaffDialog from "../../components/add-staf-dialog";

const ManagerDashboard = () => {
  const { data, isLoading } = useGetDiagnosticManagerStatsQuery(undefined);

  const stats = data?.stats;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* DOCTORS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </div>

          <p className="text-xs text-gray-500">টোটাল ডাক্তার</p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.totalDoctors || 0}
          </h3>
        </div>

        {/* TODAY APPOINTMENTS */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50">
            <Calendar className="h-5 w-5 text-cyan-600" />
          </div>

          <p className="text-xs text-gray-500">আজকের সিরিয়াল</p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.todayAppointments || 0}
          </h3>
        </div> */}

        {/* COMPLETED */}
        {/* <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
            <Activity className="h-5 w-5 text-green-600" />
          </div>

          <p className="text-xs text-gray-500">সম্পন্ন হয়েছে</p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.completedAppointments || 0}
          </h3>
        </div> */}

        {/* STAFF */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
            <Users className="h-5 w-5 text-purple-600" />
          </div>

          <p className="text-xs text-gray-500">মোট স্টাফ</p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {stats?.totalStaffs || 0}
          </h3>
        </div>
      </div>
      {/* STAFF ACTIVITIES */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">স্টাফদের কার্যক্রম</h3>

          <button className="text-xs font-medium text-blue-600">
            সব দেখুন
          </button>
        </div>

        <div className="space-y-4">
          {stats?.staffActivities && stats?.staffActivities?.length > 0 ? (
            stats.staffActivities.map((staff: any) => (
              <div
                key={staff.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {staff?.name?.charAt(0)}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {staff.name}
                    </h4>

                    <p className="text-xs text-gray-500">{staff.role}</p>

                    {staff.assignedDoctor && (
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        ডাক্তার: {staff.assignedDoctor}
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="text-[11px] font-medium text-gray-400">বুকিং</p>

                  <p className="text-lg font-bold text-blue-600">
                    {staff.totalBookings}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-sm text-gray-400">
              কোনো স্টাফ পাওয়া যায়নি
            </div>
          )}
        </div>
      </section>
      {/* ACTION */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <AddStaffDialog />
      </div>
    </main>
  );
};

export default ManagerDashboard;
