"use client";

import { useGetManagerDashboardQuery } from "@/redux/api/summary";
import { Activity, Building2, Calendar, Star, Users } from "lucide-react";

export default function ManagerDashboardPage() {
  const { data, isLoading } = useGetManagerDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Activity className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const dashboard = data?.data;

  if (!dashboard) return null;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manager Dashboard
          </h1>
          <p className="text-slate-500">
            Area: <span className="font-semibold">{dashboard.area}</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Doctors"
          value={dashboard.stats.doctors}
          icon={<Users className="text-blue-500" />}
        />

        <StatCard
          title="Clinics"
          value={dashboard.stats.clinics}
          icon={<Building2 className="text-purple-500" />}
        />

        <StatCard
          title="Appointments"
          value={dashboard.stats.appointments.total}
          icon={<Calendar className="text-orange-500" />}
        />

        <StatCard
          title="Reviews"
          value={dashboard.stats.reviews}
          icon={<Star className="text-yellow-500" />}
        />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          title="Completed"
          value={dashboard.stats.appointments.completed}
          color="text-emerald-600"
        />

        <InfoCard
          title="Pending"
          value={dashboard.stats.appointments.pending}
          color="text-yellow-500"
        />

        <InfoCard
          title="Memberships"
          value={dashboard.stats.memberships}
          color="text-blue-600"
        />
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Quick Insights</h2>

        <div className="text-sm text-slate-600 space-y-2">
          <p>📍 Active area: {dashboard.area}</p>
          <p>👨‍⚕️ Doctors are actively growing in this region</p>
          <p>🏥 Clinics are stable and connected with memberships</p>
          <p>📅 Appointment flow is moderate</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stat Card ---------------- */
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-slate-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

/* ---------------- Info Card ---------------- */
function InfoCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="text-slate-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
