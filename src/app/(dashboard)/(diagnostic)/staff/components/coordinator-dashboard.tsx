"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import AppPagination from "@/components/app-pagination";
import Loader from "@/components/loader";
import { useDebounce } from "@/hooks/useDebaunce";
import { registerNotification } from "@/lib/registernotification";
import {
  useAcceptEmergencyMutation,
  useCompleteAppointmentMutation,
  useGetCoordinatorDashboardQuery,
  useRejectEmergencyMutation,
  useUpdateAppointmentMutation,
  useUpdateDoctorSessionMutation,
} from "@/redux/api/appointmentApi";
import {
  Check,
  CheckCircle2,
  Edit,
  Loader2,
  X,
  XCircle,
  Zap,
} from "lucide-react";
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
  const [acceptEmergency] = useAcceptEmergencyMutation();
  const [updateDoctorSession, { isLoading: isUpdatingSession }] =
    useUpdateDoctorSessionMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  // =====================================================
  // DATA
  // =====================================================
  const appointments = data?.data?.appointments || [];
  const doctor = data?.data?.doctor;
  const session = data?.data?.doctorSession || {};
  const stats = data?.stats;
  const meta = data?.meta;

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
  const handleUpdatePayment = async (aptId: string, paymentStatus: any) => {
    try {
      await updateAppointment({ id: aptId, paymentStatus }).unwrap();

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
  const handleAcceptEmergency = async (id: string) => {
    try {
      await acceptEmergency(id).unwrap();

      toast.success("অ্যাপয়েন্টমেন্ট সম্পন্ন হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "স্ট্যাটাস আপডেট ব্যর্থ");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (isLoading) {
    return <Loader />;
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
              {doctor?.name || "Unknown"}
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
          const isSessionInactive = session?.status !== "ACTIVE";

          // Emergency States
          const emergencyStatus = appt?.emergency?.status; // PENDING, ACCEPT, REJECTED
          const isEmergencyPending = emergencyStatus === "PENDING";
          const isEmergencyAccepted = emergencyStatus === "ACCEPT";

          return (
            <div
              key={appt.id}
              className={`group p-4 rounded-[24px] border transition-all duration-300 ${
                isEmergencyPending
                  ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm ring-1 ring-amber-100"
                  : "border-slate-100 bg-white hover:border-blue-100 hover:shadow-md shadow-sm"
              } ${isDisabled ? "opacity-75" : ""}`}
            >
              <div className="flex justify-between items-start">
                {/* LEFT SIDE: Identity & Info */}
                <div className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg transition-colors ${
                      isEmergencyPending
                        ? "bg-amber-500 shadow-amber-100"
                        : "bg-slate-900 shadow-slate-200"
                    }`}
                  >
                    <span className="text-[14px] font-black text-white leading-none">
                      {appt.serialNumber?.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[15px] text-slate-900 tracking-tight">
                        {appt.patientName}
                      </h3>
                      {isEmergencyPending && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                      <span className="text-[11px] font-semibold">
                        {appt.contactNumber}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-semibold">
                        {appt.age}y
                      </span>
                    </div>

                    {/* Emergency Status Badges */}
                    {emergencyStatus && (
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-1.5 w-fit border ${
                          isEmergencyPending
                            ? "bg-amber-50 border-amber-100 text-amber-700" // Pending - Yellow/Amber
                            : isEmergencyAccepted
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700" // Accepted - Green
                              : emergencyStatus === "REJECTED"
                                ? "bg-rose-50 border-rose-100 text-rose-600" // Rejected - Light Red/Rose
                                : "bg-slate-50 border-slate-200 text-slate-500" // Others/Default - Gray
                        }`}
                      >
                        {isEmergencyPending && (
                          <Zap size={10} fill="currentColor" />
                        )}
                        {emergencyStatus === "REJECTED" && (
                          <XCircle size={10} fill="currentColor" />
                        )}
                        Em {emergencyStatus}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: Action Buttons Logic Fixed */}
                <div className="flex items-center gap-2">
                  {!isDisabled && (
                    <>
                      {/* ১. Reject Button: শুধু পেন্ডিং ইমার্জেন্সির জন্য */}
                      {isEmergencyPending && (
                        <button
                          onClick={() => handleRejectEmergency(appt.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                          title="Reject Emergency"
                        >
                          <X size={20} strokeWidth={2.5} />
                        </button>
                      )}

                      {/* ২. Main Action Button: লজিক কারেকশন */}
                      <button
                        onClick={() => {
                          isEmergencyPending
                            ? handleAcceptEmergency(appt.id)
                            : handleComplete(appt);
                        }}
                        disabled={isSessionInactive}
                        className={`h-10 px-4 flex items-center justify-center gap-2 rounded-xl font-black text-[11px] transition-all active:scale-95
                  ${
                    isEmergencyPending
                      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-100"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100"
                  }
                  ${isSessionInactive ? "opacity-30 grayscale cursor-not-allowed" : ""}
                `}
                      >
                        {isEmergencyPending ? "ACCEPT EM" : "MARK DONE"}
                        <Check size={16} strokeWidth={3} />
                      </button>
                    </>
                  )}

                  {/* ৩. Completed Status */}
                  {isCompleted && (
                    <div className="h-10 px-4 flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-[11px]">
                      COMPLETED <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER: Quick Settings & Meta */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    {[
                      { id: "PENDING", label: "বাকি", color: "text-amber-600" },
                      { id: "PAID", label: "পেইড", color: "text-emerald-600" },
                    ].map((pay) => {
                      const isSelected = appt?.paymentStatus === pay.id;
                      return (
                        <button
                          key={pay.id}
                          onClick={() => handleUpdatePayment(appt.id, pay.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            isSelected
                              ? `bg-white shadow-sm ${pay.color}`
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {pay.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setSelectedAppointment(appt)}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group/edit"
                  >
                    <Edit
                      size={14}
                      className="group-hover/edit:rotate-12 transition-transform"
                    />
                    <span className="text-[10px] font-bold uppercase">
                      Edit
                    </span>
                  </button>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    isCompleted
                      ? "bg-emerald-100/50 text-emerald-700"
                      : isCancelled
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {appt.status}
                </div>
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
