"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import AppPagination from "@/components/app-pagination";
import { useDebounce } from "@/hooks/useDebaunce";
import { registerNotification } from "@/lib/registernotification";
import {
  useCompleteAppointmentMutation,
  useGetCoordinatorDashboardQuery,
  useRejectEmergencyMutation,
  useUpdateDoctorSessionMutation,
} from "@/redux/api/appointmentApi";
import { AlertCircle, Check, Edit, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreateAppointmentModal from "../../components/dashboard-appointmet-dialog";

const CoordinatorDashboard = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const limit = 10;

  // =====================================================
  // API
  // =====================================================
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, isFetching, refetch } =
    useGetCoordinatorDashboardQuery({
      page,
      limit,
      status: status || undefined,
      search: debouncedSearch || undefined,
    });

  const [completeAppointment] = useCompleteAppointmentMutation();
  const [rejectEmergency] = useRejectEmergencyMutation();
  const [updateDoctorSession, { isLoading: isUpdatingSession }] =
    useUpdateDoctorSessionMutation();
  // =====================================================
  // DATA
  // =====================================================
  const appointments = data?.data?.appointments || [];
  const doctor = data?.data?.doctor;
  const session = data?.data?.doctorSession || {};
  const stats = data?.stats;
  const meta = data?.meta;

  console.log(session);
  useEffect(() => {
    const requestNotificationPermission = async () => {
      await registerNotification();
    };

    requestNotificationPermission();
  }, []);

  // 💡 যোগ করা ডক্টর সেশন আপডেট ফাংশন
  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateDoctorSession({
        newStatus,
      }).unwrap();

      toast.success("অ্যাপয়েন্টমেন্ট সম্পন্ন হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "স্ট্যাটাস আপডেট ব্যর্থ");
    }
  };

  const handleComplete = async (appointment: any) => {
    try {
      await completeAppointment(appointment.id).unwrap();

      toast.success("অ্যাপয়েন্টমেন্ট সম্পন্ন হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "স্ট্যাটাস আপডেট ব্যর্থ");
    }
  };

  const handleRejectEmergency = async (id: string) => {
    try {
      await rejectEmergency(id).unwrap();

      toast.success("অ্যাপয়েন্টমেন্ট সম্পন্ন হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "স্ট্যাটাস আপডেট ব্যর্থ");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-6">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
        {/* TOP BAR */}
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          {/* LEFT */}
          <div className="leading-tight flex-1 min-w-0">
            <h1 className="text-base font-bold truncate text-slate-800">
              Dr. {doctor?.name || "Unknown"}
            </h1>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {doctor?.department || "No Department"}
            </p>

            {/* INTERACTIVE STATUS DROPDOWN */}
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="status-select" className="sr-only">
                Update Status
              </label>
              <div className="relative inline-block w-auto">
                <select
                  id="status-select"
                  value={session?.status || ""}
                  disabled={isUpdatingSession} // লোড হওয়ার সময় ড্রপডাউন অফ থাকবে
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`
                    appearance-none text-[11px] font-semibold px-2.5 py-1 pr-6 rounded-full border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300 transition-colors duration-200 disabled:opacity-60
                    ${
                      session?.status === "ACTIVE"
                        ? "bg-green-50 text-green-600"
                        : session?.status === "PAUSED"
                          ? "bg-amber-50 text-amber-600"
                          : session?.status === "ABSENT"
                            ? "bg-orange-50 text-orange-600"
                            : session?.status === "ENDED"
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  <option value="" disabled>
                    NO SESSION
                  </option>
                  <option
                    value="ACTIVE"
                    className="bg-white text-green-600 font-medium"
                  >
                    ACTIVE
                  </option>
                  <option
                    value="PAUSED"
                    className="bg-white text-amber-600 font-medium"
                  >
                    PAUSED
                  </option>
                  <option
                    value="ABSENT"
                    className="bg-white text-orange-600 font-medium"
                  >
                    ABSENT
                  </option>
                  <option
                    value="ENDED"
                    className="bg-white text-red-600 font-medium"
                  >
                    ENDED
                  </option>
                </select>

                {/* Custom Dropdown Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-current opacity-70">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* সেশন লাইভ আপডেট ইন্ডিকেটর স্পিনার */}
              {isUpdatingSession && (
                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-shrink-0">
            <CreateAppointmentModal />
          </div>
        </div>

        {/* MINI STATS (compact row) */}
        <div className="grid grid-cols-3 text-center border-t border-slate-100 divide-x divide-slate-100">
          <Stat label="Waiting" value={stats?.scheduled || 0} color="amber" />
          <Stat label="Done" value={stats?.completed || 0} color="blue" />
          <Stat label="Canceled" value={stats?.cancelled || 0} color="red" />
        </div>
      </div>

      {/* FILTER SEARCH */}
      <div className="px-4 py-2 flex gap-2 items-center bg-white border-b">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Phone / Serial"
          className="flex-1 px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-2 py-2 text-sm border rounded-xl focus:outline-none"
        >
          <option value="">All</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="p-4 space-y-3">
        {appointments.map((appt: any) => {
          const isCompleted = appt.status === "COMPLETED";
          const isCancelled = appt.status === "CANCELLED";
          const isDisabled = isCompleted || isCancelled;

          const emergencyStatus = appt.emergency?.status; // PENDING, ACCEPTED, REJECTED
          const isEmergencyPending = emergencyStatus === "PENDING";
          const isEmergencyRejected = emergencyStatus === "REJECTED";

          const isSessionInactive = session?.status !== "ACTIVE";

          return (
            <div
              key={appt.id}
              className={`p-4 rounded-2xl border bg-white shadow-sm transition-all
          ${isEmergencyPending ? "border-amber-200 bg-amber-50/30" : "border-slate-100"}`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3">
                  {/* SERIAL BOX */}
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 border border-slate-50">
                    <p className="text-[8px] text-slate-400 font-bold uppercase">
                      SL
                    </p>
                    <p className="text-lg font-black text-slate-900 leading-none">
                      {appt.serialNumber?.toString().padStart(2, "0")}
                    </p>
                  </div>

                  {/* PATIENT INFO */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-800 leading-tight">
                        {appt.patientName}
                      </h3>
                      {isEmergencyPending && (
                        <span className="px-1.5 py-0.5 text-[8px] rounded-md bg-amber-500 text-white font-bold animate-pulse">
                          REQ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {appt.contactNumber}
                    </p>
                  </div>
                </div>

                {/* ACTIONS: ২ টি প্রধান অ্যাকশন */}
                <div className="flex items-center gap-2">
                  {/* ১. Reject Action (শুধু Pending থাকলে দেখা যাবে) */}
                  {isEmergencyPending && !isDisabled && (
                    <button
                      onClick={() => handleRejectEmergency(appt.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                      title="Reject Emergency"
                    >
                      <X size={18} />
                    </button>
                  )}

                  {/* ২. Accept/Complete Action */}
                  <button
                    onClick={() => handleComplete(appt)}
                    disabled={isDisabled || isSessionInactive}
                    className={`min-w-[36px] h-9 px-2 flex items-center justify-center gap-2 transition-all shadow-sm rounded-xl font-bold text-[10px]
                ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                    : isEmergencyPending
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 px-3"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                }
                ${isSessionInactive && !isCompleted ? "opacity-30 grayscale cursor-not-allowed" : ""}
              `}
                  >
                    {isCompleted ? (
                      <Check size={18} strokeWidth={3} />
                    ) : isEmergencyPending ? (
                      <>
                        ACCEPT & <Check size={14} />
                      </>
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* REJECTED & FOOTER INFO */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  {isEmergencyRejected ? (
                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> Emergency Rejected
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Age: {appt.age}y • {appt.status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedAppointment(appt)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CONTAINER */}
      {selectedAppointment && (
        <CreateAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* PAGINATION */}
      {meta?.totalPage > 1 && (
        <div className="px-4 mt-4">
          <AppPagination meta={meta} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

// অভ্যন্তরীণ মোবাইল-অপ্টিমাইজড Stat কম্পোনেন্ট
const Stat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "blue" | "red";
}) => {
  const colors = {
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="py-2.5 flex flex-col items-center justify-center">
      <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
        {label}
      </p>
      <span
        className={`mt-0.5 px-2 py-0.5 text-xs font-bold rounded-full ${colors[color]}`}
      >
        {value}
      </span>
    </div>
  );
};

export default CoordinatorDashboard;
