/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/loader";
import { useGetDiagnosticManagerStatsQuery } from "@/redux/api/diagnosticApi";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Filter,
  UserCheck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RechargeModal from "./reacharge";

const ModernDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const { data: statsData } = useGetDiagnosticManagerStatsQuery(dateRange);
  const stats = statsData?.stats;

  if (!stats) return <Loader />;

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header & Controls Section */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Diagnostic Overview
            </h1>
            <p className="text-slate-500 text-xs mt-2">
              Viewing analytics for:{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {dateRange.startDate} — {dateRange.endDate}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wallet Section */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Balance
                </p>
                <p className="text-lg font-bold">
                  {stats.walletBalance?.toLocaleString()} ৳
                </p>
              </div>
            </div>
            <RechargeModal
              isOpen={isModalOpen}
              // এখানে () => setIsModalOpen(false) ব্যবহার করুন
              onClose={() => setIsModalOpen(false)}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
            >
              Recharge
            </button>
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Filter size={16} className="text-slate-400 ml-2" />
            <input
              type="date"
              className="bg-transparent text-[11px] font-bold w-full focus:outline-none"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
            <span className="text-slate-300">to</span>
            <input
              type="date"
              className="bg-transparent text-[11px] font-bold w-full focus:outline-none"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Bookings",
            val: stats.summary.totalBookings,
            icon: CalendarDays,
            color: "text-blue-600",
          },
          {
            label: "Completed",
            val: stats.summary.completedCount,
            icon: CheckCircle2,
            color: "text-emerald-600",
          },
          {
            label: "Cancelled",
            val: stats.summary.cancelledCount,
            icon: AlertCircle,
            color: "text-rose-600",
          },
          {
            label: "Platform",
            val: stats.summary.platformBookings,
            icon: Activity,
            color: "text-indigo-600",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center"
          >
            <item.icon className={`${item.color} mb-2`} size={20} />
            <p className="text-[10px] text-slate-400 uppercase font-bold">
              {item.label}
            </p>
            <h3 className="text-lg font-bold">{item.val}</h3>
          </div>
        ))}
      </div>

      {/* Charts & Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-6">Booking Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  fill="#dbeafe"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
          <PerformanceList
            title="Top Doctors"
            data={stats.doctorPerformance}
            icon={BarChart3}
            color="text-blue-600"
          />
          <PerformanceList
            title="Top Staff"
            data={stats.staffPerformance}
            icon={UserCheck}
            color="text-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Component for cleaner code
const PerformanceList = ({ title, data, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-[220px] flex flex-col">
    <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
      <Icon size={16} className={color} /> {title}
    </h3>
    <div className="space-y-3 overflow-y-auto pr-2">
      {data.map((item: any, i: number) => (
        <div key={i} className="flex justify-between items-center text-xs">
          <p className="truncate font-medium text-slate-600">{item.name}</p>
          <span className="font-bold bg-slate-100 px-2 py-0.5 rounded">
            {item.appointmentCount}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default ModernDashboard;
