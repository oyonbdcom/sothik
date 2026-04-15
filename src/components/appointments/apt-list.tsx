/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Error from "@/app/error";
import {
  IAppointmentResponse,
  StatCardProps,
  StatColor,
  StatusBadgeProps,
} from "@/interface/appointment";
import { cn } from "@/lib/utils/utils";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { useGetAreasQuery, useGetDistrictsQuery } from "@/redux/api/setup";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Phone,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import AppPagination from "../app-pagination";
import UpdateDialog from "./update-dialog";

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
  const [district, setDistrict] = useState(""); // জেলা স্লাগ
  const [area, setArea] = useState(""); // এরিয়া স্লাগ
  const [selectedAppointment, setSelectedAppointment] = useState<any>();
  const { data: distData } = useGetDistrictsQuery(undefined);
  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery(
    district,
    {
      skip: !district, // জেলা সিলেক্ট না করলে এরিয়া কুয়েরি হবে না
    },
  );
  const districts = distData?.districts || [];
  const areas = areaData?.areas || [];
  const query: Record<string, any> = {
    page,
    limit: 12,
    ...(searchTerm && { searchTerm }),
    ...(status !== "ALL" && { status }),
    ...(date && { date }),
    ...(district && { district }),
    ...(area && { area }),
  };

  const { data, isLoading, isError } = useGetMyAppointmentsQuery(query);

  const appointments: any[] = data?.appointments || [];
  const meta = data?.meta;
  const stats = data?.stats || {
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
  };

  const handleSelectedApt = (apt: IAppointmentResponse) => {
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
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1); // filter change হলে page reset
                  }}
                  className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
                >
                  <option value="ALL">সব</option>
                  <option value="SCHEDULED">নির্ধারিত</option>
                  <option value="COMPLETED">সম্পন্ন</option>
                  <option value="CANCELLED">বাতিল</option>
                  <option value="PENDING">অপেক্ষমান</option>
                </select>
              </div>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
              >
                <option value="">সব জেলা</option>
                {districts.map((dist: any) => (
                  <option key={dist.id} value={dist.slug}>
                    {dist.name}
                  </option>
                ))}
              </select>

              {/* Area (Slug) */}
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                disabled={!district}
                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm disabled:opacity-50"
              >
                <option value="">
                  {isAreaLoading ? "লোড হচ্ছে..." : "সব এরিয়া"}
                </option>
                {areas.map((a: any) => (
                  <option key={a.id} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="px-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-600 outline-none"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* টেবিল কার্ড */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* টেবিল কার্ড */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800">
                    <th className="w-[30%] px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      রোগীর তথ্য
                    </th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">
                      সিরিয়াল ও সময়
                    </th>
                    <th className="w-[25%] px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      নিযুক্ত চিকিৎসক
                    </th>
                    <th className="w-[15%] px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      অবস্থা
                    </th>
                    <th className="w-[10%] px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {appointments.map((apt: IAppointmentResponse) => (
                    <tr
                      key={apt.id}
                      className="group hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all"
                    >
                      {/* রোগীর তথ্য */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                            {apt.patient?.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                              {apt.patient?.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone size={10} className="text-blue-500" />
                              {apt?.phoneNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* সিরিয়াল, তারিখ ও সময় - সব এক কলামে */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {/* সিরিয়াল নম্বর */}
                          <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800">
                            #{apt.serialNumber || "00"}
                          </span>

                          {/* তারিখ এবং ১২ ঘণ্টার সময়সূচী */}
                          <div className="flex  w-full  items-center gap-4 text-[10px] font-bold text-slate-400  ">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} className="text-slate-400" />
                              {new Date(
                                apt?.appointmentDate,
                              ).toLocaleDateString("en-GB")}
                            </span>
                            {apt?.times && (
                              <span className="flex items-center gap-1">
                                <Clock size={10} className="text-slate-400" />
                                {formatTime12hr(apt?.times || "N/A")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* চিকিৎসক ও প্রতিষ্ঠান */}
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                            {apt.doctor?.name}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                            <Building2 size={11} />
                            {apt.clinic?.name}
                          </p>
                        </div>
                      </td>

                      {/* স্ট্যাটাস */}
                      <td className="px-4 py-3">
                        <StatusBadge status={apt?.status || "SCHEDULED"} />
                      </td>

                      {/* অ্যাকশন */}
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleSelectedApt(apt)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {meta?.totalPage && meta.totalPage > 1 && (
            <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
          )}
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
const formatTime12hr = (time: string) => {
  if (!time || time === "N/A") return "N/A";
  try {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch (e) {
    return time; // যদি ফরম্যাটে ভুল থাকে তবে যা আছে তাই দেখাবে
  }
};
