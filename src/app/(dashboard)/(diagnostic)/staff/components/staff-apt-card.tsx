/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { Clock, Edit3, Phone, User2 } from "lucide-react";

export default function AppointmentCard({
  appt,
  onEdit,
}: {
  appt: any;
  onEdit?: (a: any) => void;
}) {
  return (
    <div
      key={appt.id}
      className="bg-white p-4 rounded-2xl border shadow-sm space-y-1"
    >
      {/* ===================================================== */}
      {/* ROW 1: PATIENT + SERIAL + STATUS */}
      {/* ===================================================== */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <div className="text-center min-w-[50px]">
            <p className="text-[10px] text-slate-400">Serial</p>
            <p className="text-lg font-black text-blue-600">
              {appt.serialNumber?.toString().padStart(2, "0")}
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <User2 size={14} />
              {appt.patientName}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Phone size={10} />
                {appt.contactNumber}
              </p>

              {appt.age && (
                <>
                  <span className="text-slate-300">•</span>

                  <span className="text-[11px] text-slate-500">
                    বয়স: {appt.age}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-bold">
          {appt.status}
        </span>
      </div>

      {/* ===================================================== */}
      {/* ROW 2: DOCTOR + diagnostic + SOURCE */}
      {/* ===================================================== */}
      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="font-semibold text-blue-600">
          {appt.doctor?.user?.name}
        </span>

        {/* <span className="text-slate-300">•</span>

                <span className="text-slate-500">
                  {appt.diagnostic?.user?.name}
                </span> */}

        <span className="text-slate-300">•</span>

        <span
          className={`
          px-2 py-0.5 rounded-full text-[10px] font-bold
          ${
            appt.source === "PLATFORM"
              ? "bg-blue-50 text-blue-600"
              : "bg-emerald-50 text-emerald-600"
          }
        `}
        >
          {appt.source}
        </span>

        {appt?.createdBy?.name && (
          <>
            <span className="text-slate-300">•</span>

            <span className="text-slate-400">{appt?.createdBy?.name}</span>
          </>
        )}
      </div>

      {/* ===================================================== */}
      {/* ROW 3: DATE + ACTION */}
      {/* ===================================================== */}
      <div className="flex justify-between items-center border-t ">
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock size={10} />
          {format(new Date(appt.appointmentDate), "dd MMM yyyy")}
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(appt)}
            className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
