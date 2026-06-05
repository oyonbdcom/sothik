/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader2, Stethoscope, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";

import Loader from "@/components/loader";
import { useGetDiagnosticManagerStatsQuery } from "@/redux/api/diagnosticApi";
import {
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "@/redux/api/staffApi";
import AddStaffDialog from "../../components/add-staf-dialog";

const ManagerDashboard = () => {
  // Global dashboard KPI stats query
  const { data: statsData, isLoading: isStatsLoading } =
    useGetDiagnosticManagerStatsQuery(undefined);

  // Realtime full staff collection query
  const { data: staffList, isLoading: isStaffLoading } =
    useGetAllStaffQuery(undefined);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const stats = statsData?.stats;

  const handleDelete = async (staffId: string) => {
    const isConfirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই স্টাফ মুছে ফেলতে চান?",
    );
    if (!isConfirmed) return;

    try {
      await deleteStaff(staffId).unwrap();
      toast.success("স্টাফ সফলভাবে মুছে ফেলা হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "মুছে ফেলতে সমস্যা হয়েছে");
    }
  };

  // Global Page Loading: Shell skeleton layer only triggers when critical layout metrics are missing
  if (isStatsLoading) {
    return <Loader />;
  }

  return (
    <main className="space-y-6 p-4">
      {/* KPI METRIC CARDS */}
      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL DOCTORS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">টোটাল ডাক্তার</p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 tabular-nums">
            {stats?.totalDoctors || 0}
          </h3>
        </div>

        {/* TOTAL STAFF */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 font-medium">মোট স্টাফ</p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 tabular-nums">
            {stats?.totalStaffs || 0}
          </h3>
        </div>

        {/* TODAY'S APPOINTMENTS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
            {/* Dynamic inline SVG representation for Today's tasks */}
            <svg
              className="h-5 w-5 text-amber-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            আজকের অ্যাপয়েন্টমেন্ট
          </p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 tabular-nums">
            {stats?.todayAppointments || 0}
          </h3>
        </div>

        {/* COMPLETED APPOINTMENTS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
            {/* Dynamic inline SVG representation for Completed checkmarks */}
            <svg
              className="h-5 w-5 text-emerald-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            সম্পন্ন অ্যাপয়েন্টমেন্ট
          </p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 tabular-nums">
            {stats?.completedAppointments || 0}
          </h3>
        </div>
      </div>

      {/* STAFF ACTIVITIES SECTION */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">স্টাফদের কার্যক্রম</h3>
          <button className="text-xs font-medium text-blue-600">
            সব দেখুন
          </button>
        </div>

        {/* CONTAINER CONTENT AREA */}
        <div className="space-y-4">
          {isStaffLoading ? (
            /* Sub-context Inline Loader: Keeps panel shape intact while syncing records */
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <p className="text-xs font-medium">স্টাফ তালিকা লোড হচ্ছে...</p>
            </div>
          ) : staffList?.data && staffList?.data?.length > 0 ? (
            staffList.data.map((staff: any) => {
              return (
                <div
                  key={staff.id}
                  className="flex flex-col gap-3 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4 md:border-0 md:border-b md:border-slate-100 md:py-4 md:px-2 md:rounded-xl md:bg-transparent md:shadow-none md:hover:bg-slate-50/50"
                >
                  {/* IDENTITY BLOCK */}
                  <div className="flex items-start gap-3.5 md:col-span-7 md:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-bold text-blue-600 border border-blue-100 shadow-sm md:h-12 md:w-12">
                      {staff?.user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-none">
                          {staff?.user?.name || "অজানা স্টাফ"}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            staff?.staffType === "COORDINATOR"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}
                        >
                          {staff?.staffType === "COORDINATOR"
                            ? "কো-অর্ডিনেটর"
                            : "রিসেপশনিস্ট"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                          {staff?.user?.phoneNumber || "মোবাইল নম্বর নেই"}
                        </p>
                        {staff?.assignedDoctor?.user?.name && (
                          <p className="inline-flex items-center text-[11px] font-medium text-slate-400 mt-1 md:mt-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                            ডাক্তার:{" "}
                            <span className="text-slate-600 font-semibold ml-1">
                              {staff.assignedDoctor.user.name}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 md:hidden" />

                  {/* BOTTOM INFO ROW */}
                  <div className="flex items-center justify-between mt-1 md:mt-0 md:col-span-5 md:grid md:grid-cols-5 md:items-center">
                    <div className="text-left md:col-span-3 md:text-right md:pr-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none md:hidden">
                        বুকিং সংখ্যা
                      </p>
                      <div className="flex items-baseline gap-1 mt-1 md:mt-0 md:block">
                        <p className="text-lg font-black text-blue-600 tabular-nums md:text-xl">
                          {staff?.totalBookings ||
                            staff?.user?._count?.createdAppointments ||
                            0}
                        </p>
                        <span className="text-[11px] font-medium text-slate-400 md:hidden">
                          টি বুকিং
                        </span>
                      </div>
                    </div>

                    {/* INTERACTION UTILITIES */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 md:bg-transparent md:border-0 md:p-0 md:col-span-2 md:justify-end md:border-l md:border-slate-100 md:pl-4 md:h-9">
                      <AddStaffDialog staff={staff} />
                      <button
                        onClick={() => handleDelete(staff.id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50/80 transition-all active:scale-90 disabled:opacity-40"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-sm text-gray-400">
              কোনো স্টাফ পাওয়া যায়নি
            </div>
          )}
        </div>
      </section>

      {/* FOOTER ACTIONS FRAME */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <AddStaffDialog />
      </div>
    </main>
  );
};

export default ManagerDashboard;
