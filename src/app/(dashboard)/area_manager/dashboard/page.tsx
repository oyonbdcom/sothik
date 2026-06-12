/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import { StatCard } from "@/components/start-card";
import { bdStartOfDay } from "@/lib/utils/utils";
import { useGetAreaManagerAppointmentsQuery } from "@/redux/api/appointmentApi";
import { useGetAllAreaDiagnosticsNameQuery } from "@/redux/api/diagnosticApi";
import { useGetAreaManagerDoctorsNameQuery } from "@/redux/api/doctorApi";
import { format } from "date-fns";
import { Calendar, ClipboardList, Loader2, Phone, User } from "lucide-react";
import { useState } from "react";
import MedicalRecordsAddDialog from "../../patient/dashboard/components/medical-records-add-dialog";
import UpdateStatusDrawer from "./drawer";

export default function ManagerAppointmentsPage() {
  // States
  const [diagId, setDiagId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState<any>(bdStartOfDay(new Date()));

  const [isEmergency, setIsEmergency] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  // Debounce for search

  // API Query
  const query: Record<string, any> = {
    page,
    limit: size,
  };

  if (status) query["status"] = status;
  if (doctorId) query["doctorId"] = doctorId;
  if (diagId) query["diagId"] = diagId;
  if (date) query["date"] = date;
  if (isEmergency !== null) {
    query["isEmergency"] = isEmergency;
  }
  const { data, isLoading, isFetching } = useGetAreaManagerAppointmentsQuery({
    ...query,
  });
  const { data: allDiagnostics, isLoading: allDiagnosticLoading } =
    useGetAllAreaDiagnosticsNameQuery();
  const { data: allDoctors, isLoading: allDoctorLoading } =
    useGetAreaManagerDoctorsNameQuery();
  const appointments = data?.appointments || [];
  const meta = data?.meta;
  const stats = data?.stats;

  if (isLoading || allDiagnosticLoading || allDoctorLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }
  const statusStyle = {
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    ACCEPT: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    SCHEDULED: "bg-blue-50 text-blue-600 border-blue-200",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
  };
  return (
    <div className=" bg-white  space-y-6  p-6 rounded-md min-h-screen">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            এরিয়া অ্যাপয়েন্টমেন্ট সমূহ
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            আপনার এরিয়ার সকল ডায়াগনস্টিক ও ডাক্তারদের বুকিং ম্যানেজ করুন
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="মোট" value={stats?.total || 0} color="slate" />

        <StatCard
          label="Scheduled"
          value={stats?.scheduled || 0}
          color="blue"
        />
        <StatCard
          label="Completed"
          value={stats?.completed || 0}
          color="green"
        />
        <StatCard
          label="Cancelled"
          value={stats?.cancelled || 0}
          color="rose"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsEmergency(true);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs border ${
              isEmergency === true
                ? "bg-red-500 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            Emergency Only
          </button>

          <button
            onClick={() => {
              setIsEmergency(null);
              setPage(1);
            }}
            className={`px-3 py-2 rounded-xl text-xs border ${
              isEmergency === null
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            All
          </button>
        </div>
        <select
          className="px-3 py-2 rounded-xl border text-xs"
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
        <select
          value={diagId}
          onChange={(e) => setDiagId(e.target.value)}
          className="px-3 py-2 rounded-xl border text-xs"
        >
          <option value="">সব ডায়াগনস্টিক</option>
          {allDiagnostics?.diagnostics?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.user?.name}
            </option>
          ))}
        </select>
        {/* doctor filter */}
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="px-3 py-2 rounded-xl border text-xs"
        >
          <option value="">সব ডাক্তার</option>
          {allDoctors?.doctors?.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border text-xs"
        />
      </div>

      {/* Appointments List */}
      <div
        className={`space-y-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
      >
        {appointments.length > 0 ? (
          appointments.map((appt: any) => {
            const isEmergency = appt?.isEmergency;

            const statusColor = isEmergency
              ? "bg-red-50 text-red-600 border-red-200"
              : statusStyle[appt.status as keyof typeof statusStyle];
            return (
              <div
                key={appt.id}
                className={`group rounded-3xl border p-4 shadow-sm transition-all hover:shadow-lg ${
                  appt.isEmergency && appt.status !== "COMPLETED"
                    ? "border-red-100 bg-red-50/30"
                    : "border-slate-100 bg-white"
                }`}
              >
                {/* Top Section */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Avatar Indicator */}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        appt.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600"
                          : appt.isEmergency
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <User size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {appt.patientName}
                        </h3>

                        {/* Emergency Badge (শুধু যদি কমপ্লিট না হয় এবং ইমার্জেন্সি হয়) */}
                        {appt.isEmergency && appt.status !== "COMPLETED" && (
                          <span className="animate-pulse rounded-md bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white uppercase">
                            Emergency
                          </span>
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Phone size={13} /> {appt.contactNumber}
                      </p>
                    </div>
                  </div>

                  {/* Primary Status Badge Logic */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide border ${statusColor}`}
                    >
                      {appt.status}
                    </span>

                    {/* Secondary Status: শুধু ইমার্জেন্সি রিকোয়েস্ট স্ট্যাটাস (Pending/Rejected) */}
                    {appt.isEmergency && appt.status === "SCHEDULED" && (
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border 
          ${
            appt.emergency?.status === "PENDING"
              ? "text-amber-600 border-amber-100 bg-amber-50"
              : appt.emergency?.status === "REJECTED"
                ? "text-rose-600 border-rose-100 bg-rose-50"
                : "hidden"
          }`}
                      >
                        Req: {appt.emergency?.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div
                  className={`mt-4 space-y-2 rounded-2xl p-3 ${
                    appt.isEmergency && appt.status !== "COMPLETED"
                      ? "bg-white border border-red-50"
                      : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <ClipboardList size={14} className="text-slate-400" />
                      ডাঃ {appt.doctor?.user?.name}
                    </div>

                    {/* সিরিয়াল বা TrxID লজিক */}
                    <span className="font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                      {appt.isEmergency && appt.status !== "COMPLETED"
                        ? `Trx: ${appt.emergency?.transactionId?.slice(-6) || "N/A"}`
                        : `#${appt.serialNumber}`}
                    </span>
                  </div>

                  {/* Payment Status (শুধু ইমার্জেন্সির জন্য) */}
                  {appt.status !== "COMPLETED" && (
                    <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px]">
                      <span className="text-slate-500">
                        Payment: {appt.paymentMethod}
                      </span>
                      <span
                        className={
                          appt.paymentStatus === "PAID"
                            ? "text-emerald-600 font-bold"
                            : "text-amber-600 font-bold"
                        }
                      >
                        {appt.paymentStatus === "PAID" ? "✓ Paid" : "Pending"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <p className="  text-[11px] font-medium text-slate-500">
                    <Calendar size={13} />
                    {format(new Date(appt.appointmentDate), "dd MMM")}
                  </p>
                  <MedicalRecordsAddDialog appointmentId={appt.id} />
                  <UpdateStatusDrawer appointment={appt} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">
              কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
            </h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
      )}
    </div>
  );
}
