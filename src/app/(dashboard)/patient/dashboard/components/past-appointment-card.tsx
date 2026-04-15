"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { avatar } from "@/config/site";
import { IAppointmentResponse } from "@/interface/appointment";
import { cn, formatTime } from "@/lib/utils/utils";
import {
  Building,
  CalendarDays,
  Clock,
  FileText,
  Hash,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import MedicalRecordGrid from "./image-view";
import MedicalRecordsAddDialog from "./medical-records-add-dialog";

export const PastAppointmentCard = ({
  appointment,
}: {
  appointment: IAppointmentResponse;
}) => {
  const [showRecords, setShowRecords] = useState(false);

  const statusConfig = {
    PENDING: {
      label: "পেন্ডিং",
      class: "bg-amber-100 text-amber-700 border-amber-200",
    },
    SCHEDULED: {
      label: "শিডিউলড",
      class: "bg-blue-100 text-blue-700 border-blue-200",
    },
    COMPLETED: {
      label: "কমপ্লিটেড",
      class: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    CANCELLED: {
      label: "বাতিল",
      class: "bg-rose-100 text-rose-700 border-rose-200",
    },
  };

  const config =
    statusConfig[appointment.status as keyof typeof statusConfig] ||
    statusConfig.SCHEDULED;

  const dateBn = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <Card className="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
      <CardContent className="p-4 md:p-6">
        {/* উপরের অংশ: ডক্টর ইনফো ও স্ট্যাটাস */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ring-2 ring-slate-50">
            <Image
              src={appointment.doctor?.image || avatar}
              alt="Doctor"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
              {appointment?.doctor?.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Building className="w-3 h-3 shrink-0" />
              <span className="truncate">{appointment?.clinic?.name}</span>
            </div>
            <span className="truncate text-xs">
              {appointment?.clinic?.clinic?.address}
            </span>
          </div>
          <Badge
            className={cn(
              "shrink-0 text-[10px] px-2 py-0.5 rounded-md",
              config.class,
            )}
          >
            {config.label}
          </Badge>
        </div>

        {/* মাঝের অংশ: ইনফরমেশন গ্রিড (২ কলাম মোবাইলে) */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 text-[12px]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              রোগীর নাম
            </p>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <User size={12} className="text-blue-500" />
              <span className="truncate">{appointment.patientName}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              সিরিয়াল নাঃ
            </p>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Hash size={12} className="text-indigo-500" />
              <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded text-[10px]">
                {appointment.serialNumber || "0"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              তারিখ
            </p>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <CalendarDays size={12} className="text-emerald-500" />
              <span>{dateBn}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              সময়
            </p>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Clock size={12} className="text-orange-500" />
              <span>
                {appointment?.times
                  ? `${formatTime(appointment.times)} আসবেন`
                  : "N/A"}{" "}
              </span>
            </div>
          </div>
        </div>

        {/* ডিসকাউন্ট সেকশন (Compact) */}
        <div
          onClick={() => {
            navigator.clipboard.writeText("OFFER25");
            toast.success("কোড কপি হয়েছে!");
          }}
          className="flex items-center justify-between bg-primary-50 dark:bg-primary-950/20 p-2 rounded-lg border border-primary-100 dark:border-primary-900/50 mb-4 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-primary-600" />
            <span className="text-[11px] font-black text-primary-700 uppercase">
              {appointment?.discount || 0}% ছাড় ({appointment?.code})
            </span>
          </div>
          <span className="text-[9px] bg-white dark:bg-primary-900 px-1.5 py-0.5 rounded shadow-sm font-bold text-primary-600">
            কপি
          </span>
        </div>

        {/* অ্যাকশন বাটনসমূহ (মোবাইলে পাশাপাশি) */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowRecords(!showRecords)}
            variant="outline"
            className={cn(
              "flex-1 h-10 text-xs font-bold rounded-xl",
              showRecords && "bg-slate-800 text-white",
            )}
          >
            <FileText size={14} className="mr-1.5" />
            রেকর্ডস
          </Button>
          <div className="flex-1">
            <MedicalRecordsAddDialog appointmentId={appointment.id} />
          </div>
        </div>

        {/* রেকর্ডস ডিসপ্লে */}
        {showRecords && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <MedicalRecordGrid
              appointment={appointment}
              showRecords={showRecords}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
