/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Error from "@/app/error";
import { useAuth } from "@/hooks/useAuth";
import { cn, getDepartmentLabel } from "@/lib/utils/utils";
import {
  useExportDoctorDailyPdfQuery,
  useGetMyAppointmentsQuery,
} from "@/redux/api/appointmentApi";
import { useGetMyDoctorsQuery } from "@/redux/api/membershipApi";
import { IMeta } from "@/types";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Hourglass,
  LayoutGrid,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import AppointmentList from "./apt-list";
import ClinicAdminAppointmentDialog from "./creteappointment";
import LoadingSkeleton from "./loadingSckltan";
import Status from "./status";
import UpdateDialog from "./update-dialog";

export const statusOptions = {
  ALL: {
    label: "সব অ্যাপয়েন্টমেন্ট",
    icon: <LayoutGrid size={16} />,
    color: "text-slate-600",
  },
  PENDING: {
    label: "পেন্ডিং",
    icon: <Hourglass size={16} />,
    color: "text-amber-600",
  },
  SCHEDULED: {
    label: "শিডিউলড",
    icon: <Clock size={16} />,
    color: "text-blue-600",
  },
  COMPLETED: {
    label: "কমপ্লিটেড",
    icon: <CheckCircle2 size={16} />,
    color: "text-emerald-600",
  },
  CANCELLED: {
    label: "বাতিল",
    icon: <XCircle size={16} />,
    color: "text-rose-600",
  },
};

export default function ClientComponent() {
  // --- States ---
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [doctorId, setDoctorId] = useState<string>("ALL");
  const [date, setDate] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>();

  const limit = 8;

  // --- API Queries ---
  const query: Record<string, any> = {
    page,
    limit,
    ...(status !== "ALL" && { status }),
    ...(doctorId !== "ALL" && { doctorId }),
    ...(date && { date }),
  };
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetMyAppointmentsQuery(query);

  const { data: doctors, isLoading: doctorLoading } =
    useGetMyDoctorsQuery(undefined);
  const { data: pdfBlob, refetch: refetchPdf } = useExportDoctorDailyPdfQuery(
    { doctorId, date, status },
    { skip: doctorId === "ALL" || !date || status === "ALL" }, // Only fetch when doctor and date are selected
  );

  const appointments: any[] = data?.appointments || [];
  const meta: IMeta = (data?.meta as IMeta) || {
    page: 1, // পেজ সাধারণত ১ থেকে শুরু হয়
    limit: 10,
    total: 0,
    totalPage: 0,
  };
  const stats = data?.stats || {
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
    pending: 0,
  };

  // --- Handlers ---
  const handleFilterChange = (
    type: "status" | "doctor" | "date",
    value: string,
  ) => {
    if (type === "status") setStatus(value);
    if (type === "doctor") setDoctorId(value);
    if (type === "date") setDate(value);
    setPage(1); // ফিল্টার বদলালে সবসময় প্রথম পেজে ফিরিয়ে আনবে
  };

  if (isLoading || doctorLoading) return <LoadingSkeleton />;
  if (isError) return <Error />;

  const handlePrintPdf = async () => {
    if (!doctorId || !date) {
      alert("Please select a doctor and date.");
      return;
    }

    try {
      // 1. Access the raw buffer data
      const rawData = pdfBlob?.data?.data;

      if (!rawData) {
        alert("No PDF data available to print.");
        return;
      }

      // 2. Convert to Uint8Array if it's a plain array of numbers
      // This is the crucial step for the data format you showed
      const byteArray = new Uint8Array(rawData);
      const pdfFile = new Blob([byteArray], { type: "application/pdf" });

      // 3. Create object URL
      const url = URL.createObjectURL(pdfFile);

      // 4. Open and Print
      const printWindow = window.open(url, "_blank");

      if (printWindow) {
        printWindow.onload = () => {
          // Some browsers need a slight delay to render the PDF before print()
          setTimeout(() => {
            printWindow.print();
            // Note: revoking immediately might break the print dialog in some browsers
            // It's safer to revoke after a longer delay or on window close
          }, 1000);
        };
      } else {
        alert("Please allow popups to print the PDF.");
      }
    } catch (err) {
      console.error("Error printing PDF:", err);
      alert("Failed to print PDF.");
    }
  };
  const handleDownloadPdf = () => {
    if (!doctorId || !date) {
      alert("Please select a doctor and date.");
      return;
    }

    try {
      // 1. Access the raw numeric array (buffer) from your response structure
      const rawData = pdfBlob?.data?.data;

      if (!rawData || !Array.isArray(rawData)) {
        alert("No PDF data available to download.");
        return;
      }

      // 2. Convert the numeric array into a binary Uint8Array
      const byteArray = new Uint8Array(rawData);

      // 3. Create a Blob (Binary Large Object) from the bytes
      const pdfFile = new Blob([byteArray], { type: "application/pdf" });

      // 4. Create a temporary URL for the Blob
      const url = URL.createObjectURL(pdfFile);

      // 5. Create a hidden "anchor" element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `OPD-List-${date}.pdf`); // Filename user will see

      // 6. Append to body, click it, and remove it immediately
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 7. Cleanup: Revoke the URL after a small delay to free up browser memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to generate download.");
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        {/* উপরের স্ট্যাটাস কার্ডস */}
        <Status stats={stats} />

        {/* ফিল্টার সেকশন */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* 1. Doctor Filter - Scaled to match other inputs */}
            <div className="relative flex-[1.5] w-full   max-w-64 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-indigo-500 pointer-events-none">
                <Stethoscope size={20} />
              </div>
              <select
                value={doctorId}
                onChange={(e) => handleFilterChange("doctor", e.target.value)}
                className="w-full appearance-none bg-slate-50/50 border border-slate-100 py-3 pl-12 pr-10 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none cursor-pointer"
              >
                {/* Placeholder logic to ensure a doctor is selected for your PDF requirements */}
                <option value="" disabled>
                  চিকিৎসক নির্বাচন করুন
                </option>
                {doctors?.map((doc: any) => (
                  <option key={doc.id} value={doc.userId}>
                    {doc.name} — (
                    {getDepartmentLabel(doc.department) || "General"})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Desktop Divider - Spacing adjusted */}
            <div className="hidden lg:block w-[1px] h-8 bg-slate-200 mx-1" />

            {/* 2. Status & Date Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Status Dropdown */}
              <div className="relative w-full group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-slate-400 group-focus-within:text-indigo-500">
                  {statusOptions[status as keyof typeof statusOptions]
                    ?.icon || <Filter size={18} />}
                </div>
                <select
                  value={status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className={cn(
                    "w-full appearance-none bg-slate-50/50 border border-slate-100 py-3 pl-11 pr-10 rounded-2xl text-sm font-bold transition-all outline-none cursor-pointer focus:bg-white",
                    statusOptions[status as keyof typeof statusOptions]?.color,
                  )}
                >
                  {Object.entries(statusOptions).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>

              {/* Date Input */}
              <div className="relative w-full group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-indigo-500">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-100 py-3 pl-11 pr-4 rounded-2xl text-sm font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all cursor-pointer"
                />
              </div>

              {/* Action Button Container */}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4">
          <button
            onClick={handleDownloadPdf}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Download
          </button>
          <button
            onClick={handlePrintPdf}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Print PDF
          </button>
          <div className="w-full sm:w-auto shrink-0">
            {user?.id && <ClinicAdminAppointmentDialog clinicId={user?.id} />}
          </div>
        </div>

        {/* অ্যাপয়েন্টমেন্ট টেবিল */}
        <AppointmentList
          appointments={appointments}
          setSelectedAppointment={setSelectedAppointment}
        />

        {meta && meta?.totalPage && meta?.totalPage > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
            <div className="text-sm text-slate-500 font-medium order-2 sm:order-1">
              মোট{" "}
              <span className="text-indigo-600 font-bold">{meta.total}</span> টি
              অ্যাপয়েন্টমেন্ট
            </div>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              {meta && meta?.totalPage > 1 && (
                <div className=" flex items-center  gap-2 bg-white px-6     ">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">পেছনে</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black border border-indigo-100/50">
                      {page} / {meta.totalPage}
                    </div>
                  </div>

                  {meta?.totalPage && (
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(meta?.totalPage, p + 1))
                      }
                      disabled={page === meta.totalPage}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <span className="hidden sm:inline">সামনে</span>
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* মোডাল */}
      {selectedAppointment && (
        <UpdateDialog
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
        />
      )}
    </div>
  );
}
