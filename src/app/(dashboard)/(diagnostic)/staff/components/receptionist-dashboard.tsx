/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import { useDebounce } from "@/hooks/useDebaunce";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useGetAccessibleDoctorsQuery } from "@/redux/api/doctorApi";
import CreateAppointmentModal from "../../components/dashboard-appointmet-dialog";
import AppointmentCard from "./staff-apt-card";

const ReceptionistDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  // =====================================================
  // DEBOUNCE
  // =====================================================

  const debouncedTerm = useDebounce({
    searchQuery: searchTerm,
    delay: 600,
  });

  // =====================================================
  // QUERY
  // =====================================================

  const query: Record<string, any> = {
    page,
    limit: size,
  };

  if (debouncedTerm?.searchQuery) {
    query["searchTerm"] = debouncedTerm.searchQuery;
  }

  if (status) query["status"] = status;
  if (doctorId) query["doctorId"] = doctorId;

  if (date) query["date"] = date;

  // =====================================================
  // API
  // =====================================================

  const { data, isLoading, isFetching } = useGetMyAppointmentsQuery({
    ...query,
  });

  const { data: allDoctors } = useGetAccessibleDoctorsQuery({});

  // =====================================================
  // DATA
  // =====================================================

  const appointments = data?.appointments || [];

  const meta = data?.meta;

  const stats = data?.stats;

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
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-4">
        <StatCard label="মোট" value={stats?.total} />

        <StatCard
          label="আজকের"
          value={stats?.todayAppointments || 0}
          color="blue"
        />

        <StatCard label="Scheduled" value={stats?.scheduled} color="emerald" />

        <StatCard label="Completed" value={stats?.completed} color="green" />

        <StatCard label="Cancelled" value={stats?.cancelled} color="rose" />
      </div>

      {/* ===================================================== */}
      {/* FILTER */}
      {/* ===================================================== */}

      <div className="p-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        {/* STATUS */}
        <select
          className="px-3 py-2 rounded-xl border text-xs shrink-0"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">সব স্ট্যাটাস</option>
          <option value="PENDING">Pending</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* DOCTOR */}
        <select
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border text-xs shrink-0"
        >
          <option value="">সব ডাক্তার</option>

          {allDoctors?.doctors?.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border text-xs shrink-0"
        />
      </div>

      {/* ===================================================== */}
      {/* APPOINTMENTS */}
      {/* ===================================================== */}

      <div
        className={`px-4 space-y-3 transition-opacity ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {appointments.length > 0 ? (
          appointments.map((appt: any) => (
            <AppointmentCard
              key={appt.id}
              appt={appt}
              onEdit={(a) => setSelectedAppointment(a)}
            />
          ))
        ) : (
          <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-slate-200">
            <h3 className="text-slate-400 font-bold">
              কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
            </h3>
          </div>
        )}
      </div>

      {/* ===================================================== */}
      {/* PAGINATION */}
      {/* ===================================================== */}

      {meta && meta?.totalPage > 1 && (
        <div className="px-4 mt-6">
          <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* ===================================================== */}
      {/* CREATE / UPDATE MODAL */}
      {/* ===================================================== */}

      <div className="fixed bottom-4 right-4">
        <CreateAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      </div>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value?: number;
  color?: string;
}) => {
  const styles: any = {
    slate: "text-slate-800 bg-white border-slate-100",

    blue: "text-blue-600 bg-blue-50 border-blue-100",

    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",

    green: "text-green-600 bg-green-50 border-green-100",

    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <div
      className={`p-3 rounded-2xl border shadow-sm text-center ${styles[color]}`}
    >
      <p className="text-[10px] font-bold uppercase opacity-70">{label}</p>

      <p className="text-lg font-black">{value || 0}</p>
    </div>
  );
};

export default ReceptionistDashboard;
