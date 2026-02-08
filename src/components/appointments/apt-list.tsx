/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import UpdateDialog from "@/app/(dashboard)/clinic/dashboard/appointments/update-dialog";
import Error from "@/app/error";
import {
  IAppointmentResponse,
  StatCardProps,
  StatColor,
  StatusBadgeProps,
} from "@/interface/appointment";
import { cn } from "@/lib/utils/utils";
import {
  useGetMyAppointmentsQuery,
  useUpdateAppointmentMutation,
} from "@/redux/api/appointmentApi";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

// স্ট্যাটাস ফিল্টার অনুবাদ
const statusFilters = [
  { label: "সব", value: "ALL" },
  { label: "নির্ধারিত", value: "SCHEDULED" },
  { label: "সম্পন্ন", value: "COMPLETED" },
  { label: "বাতিল", value: "CANCELLED" },
];

export default function AppointmentList() {
  const [status, setStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const [date, setDate] = useState<string>("");

  const [selectedAppointment, setSelectedAppointment] = useState<any>();
  const [serialNumber, setSerialNumber] = useState<number>(0);
  const query: Record<string, any> = {
    page,
    limit: 8,
    ...(searchTerm && { searchTerm }),
    ...(status !== "ALL" && { status }),
    ...(date && { date }),
  };

  const { data, isLoading, isError } = useGetMyAppointmentsQuery(query);
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();

  const appointments: any[] = data?.appointments || [];
  const meta = data?.meta;
  const stats = data?.stats || {
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
  };

  const handleSelectedApt = (apt: IAppointmentResponse) => {
    setSerialNumber(apt.serialNumber || 0);
    setSelectedAppointment(apt);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <Error />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* হেডার */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              অ্যাপয়েন্টমেন্ট <span className="text-blue-600">তালিকা</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              স্বাগতম! আজ আপনার{" "}
              <span className="text-blue-600 font-bold">
                {stats.scheduled}টি
              </span>{" "}
              অ্যাপয়েন্টমেন্ট বাকি আছে।
            </p>
          </div>
        </header>

        {/* স্ট্যাটস গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="মোট পেশেন্ট"
            value={stats.total}
            color="blue"
            icon={<Users />}
            change="সর্বমোট"
            trend="up"
          />
          <StatCard
            title="সম্পন্ন হয়েছে"
            value={stats.completed}
            color="emerald"
            icon={<CheckCircle2 />}
            change="সফলতা হার"
            trend="up"
          />
          <StatCard
            title="অপেক্ষমান"
            value={stats.scheduled}
            color="amber"
            icon={<Clock />}
            change="নির্ধারিত"
            trend="up"
          />
          <StatCard
            title="বাতিল হয়েছে"
            value={stats.cancelled}
            color="rose"
            icon={<AlertCircle />}
            change="অনুপস্থিত হার"
            trend="down"
          />
        </div>

        {/* সার্চ এবং ফিল্টার */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="রোগীর নাম, আইডি বা ডাক্তার দিয়ে সার্চ করুন..."
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl focus:outline-none text-slate-700 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 p-2 w-full lg:w-auto">
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {statusFilters.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      status === s.value
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <input
                type="date"
                className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 outline-none"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* টেবিল */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] lg:min-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      রোগীর তথ্য
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      ফোন নম্বর
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      সিরিয়াল নং
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      নিযুক্ত চিকিৎসক
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      ক্লিনিক/চেম্বার
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase">
                      অবস্থা
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase text-right">
                      অপশন
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.map((apt: IAppointmentResponse) => (
                    <tr
                      key={apt.id}
                      className="group hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {apt.patient?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {apt.patient?.name}
                            </p>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-bold uppercase">
                              ID: {apt.code || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                        {apt?.phoneNumber || "N/A"}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-blue-600">
                        {apt.serialNumber || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {apt.doctor?.name}
                        </p>
                        <p className="text-[10px] text-slate-400 italic">
                          বিশেষজ্ঞ চিকিৎসক
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {apt.clinic?.name}
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={apt?.status || "SCHEDULED"} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleSelectedApt(apt)}
                          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm transition-all"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* পেজিনেশন */}
          <footer className="px-8 py-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 font-medium">
              মোট{" "}
              <span className="text-slate-900 font-bold">
                {meta?.total || 0}
              </span>{" "}
              টি ফলাফলের মধ্যে{" "}
              <span className="text-slate-900 font-bold">
                {appointments.length}
              </span>{" "}
              টি দেখানো হচ্ছে
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-extrabold text-blue-600 px-4">
                {page}
              </span>
              <button
                disabled={page >= (meta?.totalPage || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* আপডেট স্ট্যাটাস মোডাল */}
      {selectedAppointment && (
        <UpdateDialog
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
        />
      )}
    </div>
  );
}

// স্ট্যাটাস ব্যাজ অনুবাদ (অভ্যন্তরীণ ব্যবহারের জন্য ইংরেজী রাখা ভালো, প্রদর্শন বাংলায় হবে)
function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, { class: string; label: string }> = {
    SCHEDULED: {
      class: "bg-blue-50 text-blue-600 border-blue-100",
      label: "নির্ধারিত",
    },
    COMPLETED: {
      class: "bg-emerald-50 text-emerald-600 border-emerald-100",
      label: "সম্পন্ন",
    },
    CANCELLED: {
      class: "bg-rose-50 text-rose-600 border-rose-100",
      label: "বাতিল",
    },
    PENDING: {
      class: "bg-amber-50 text-amber-600 border-amber-100",
      label: "অপেক্ষমান",
    },
  };

  const current = styles[status] || styles.SCHEDULED;

  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest",
        current.class,
      )}
    >
      {current.label}
    </span>
  );
}

// StatCard এবং LoadingSkeleton আপনার কোডের মতই থাকবে, শুধু লেবেলগুলো ফাংশন পাস করার সময় বাংলায় দেবেন।

function StatCard({ title, value, change, icon, color, trend }: StatCardProps) {
  const colorClasses: Record<StatColor, string> = {
    blue: "from-blue-500 to-blue-600 shadow-blue-100",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-100",
    amber: "from-amber-500 to-amber-600 shadow-amber-100",
    rose: "from-rose-500 to-rose-600 shadow-rose-100",
  };

  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold ${
            trend === "up" ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          <TrendingUp
            size={14}
            className={trend === "down" ? "rotate-180" : ""}
          />
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4 mb-10" />
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-[2rem]" />
        ))}
      </div>
      <div className="h-64 bg-slate-50 rounded-3xl" />
    </div>
  );
}
