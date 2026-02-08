/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { avatar } from "@/config/site";
import { IAppointmentResponse } from "@/interface/appointment";
import { cn, formatTime, getDepartmentLabel } from "@/lib/utils/utils";
import {
  Building,
  CalendarDays,
  Clock,
  Download,
  FileText,
  Hash,
  Phone,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImageViewerModal } from "./image-view";
import MedicalRecordsAddDialog from "./medical-records-add-dialog";

export const PastAppointmentCard = ({
  appointment,
}: {
  appointment: IAppointmentResponse;
}) => {
  const [showRecords, setShowRecords] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    appointment: appointment?.medicalRecords || [],
    currentIndex: 0,
    appointmentId: appointment?.id,
  });

  const statusConfig = {
    PENDING: {
      label: "পেন্ডিং ",
      class: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-500",
    },
    SCHEDULED: {
      label: "শিডিউলড ",
      class: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-500",
    },

    COMPLETED: {
      label: "কমপ্লিটেড ",
      class: "bg-primary-50 text-primary-700 border-primary-200",
      iconColor: "text-primary-500",
    },
    CANCELLED: {
      label: "ক্যানসেলড (বাতিল)",
      class: "bg-rose-50 text-rose-700 border-rose-200",
      iconColor: "text-rose-500",
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
    : "তারিখ নেই";

  return (
    <>
      <Card className="group border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {/* ১. ডক্টর ও ক্লিনিক সেকশন (Left Side) */}
            <div className="lg:w-[40%] p-6 lg:p-8 space-y-5 border-r border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden ring-2 ring-slate-50 shadow-inner">
                    <Image
                      src={appointment.doctor?.image || avatar}
                      alt="Doctor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* স্ট্যাটাস ইন্ডিকেটর ডট */}
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 p-1.5 rounded-lg text-white shadow-lg ring-2 ring-white",
                      `${config.class}`,
                    )}
                  ></div>
                </div>

                <div>
                  <h3 className="md:text-xl font-bold text-slate-800 dark:text-white leading-tight">
                    {appointment.doctor?.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold text-[10px] mt-1 uppercase tracking-wider">
                    {getDepartmentLabel(appointment.doctor?.doctor?.department)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[150px]">
                      {appointment.clinic?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* ডিসকাউন্ট এবং কোড সেকশন */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    className={cn(
                      "rounded-lg px-3 py-1 font-bold text-[11px]",
                      `${config.class}`,
                    )}
                  >
                    {config.label}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="bg-primary-50/50 border-dashed border-primary-300 text-primary-700 rounded-lg px-3 py-1 font-mono font-bold tracking-wider transition-all group-hover:bg-primary-100 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText("HEALTH20"); // কপি লজিক
                      toast.success("ডিসকাউন্ট কোড কপি হয়েছে!");
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      {/* একটি ছোট গ্রিন পালস ইন্ডিকেটর */}
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                      </span>
                      {/* এখানে আপনার ডিসকাউন্ট কোডটি বসবে */}
                      OFFER25
                    </span>
                  </Badge>
                </div>

                {/* নতুন ডিসকাউন্ট পার্ট - এখানে আপনার ডিসকাউন্ট ডাটা দেখাবে */}
                {/* {appointment?.discount > 0 && ( */}
                <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/30 p-2.5 rounded-xl border border-primary-100 dark:border-primary-900/50">
                  <div className="bg-primary-500 p-1.5 rounded-lg">
                    <Tag className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-primary-600 dark:text-primary-400   uppercase leading-none">
                      ডিসকাউন্ট প্রযোজ্য
                    </span>
                    <span className="text-sm font-black text-primary-700 dark:text-primary-300">
                      {appointment?.discount || 0}% ছাড়{" "}
                      <span className="text-[10px] font-normal opacity-70">
                        রিপোর্টের ওপর
                      </span>
                    </span>
                  </div>
                </div>
                {/* )} */}
              </div>
            </div>

            {/* ২. পেশেন্ট ও অ্যাপয়েন্টমেন্ট ডিটেইলস (Middle Section) */}
            <div className="lg:w-[35%] p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-800/10 flex flex-col justify-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      রোগীর নাম
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">
                      {appointment.patientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      মোবাইল নাম্বার
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">
                      {appointment.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-1">
                  {/* আইকন কন্টেইনার - একটু বড় এবং শ্যাডোসহ */}
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                    <CalendarDays size={20} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
                      তারিখ, সময়
                    </p>

                    <div className="flex items-center flex-wrap gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                      {/* তারিখ */}
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {dateBn}
                      </span>

                      <span className="text-slate-300 dark:text-slate-600 font-light">
                        |
                      </span>

                      {/* সময় - ফরম্যাটেড */}
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                        <Clock size={14} className="opacity-70" />
                        <span>
                          {appointment?.times
                            ? formatTime(appointment.times)
                            : "নির্ধারিত নেই"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-1">
                  {/* আইকন কন্টেইনার - একটু বড় এবং শ্যাডোসহ */}
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 shadow-sm border border-primary-100 dark:border-primary-900/50">
                    <Hash size={20} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
                      সিরিয়াল নাঃ
                    </p>

                    <div className="flex items-center flex-wrap gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                      <span className="bg-primary text-white px-2 py-0.5 rounded-md shadow-sm text-xs font-black">
                        {appointment.serialNumber || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ৩. অ্যাকশন বাটন সেকশন (Right Side) */}
            <div className="lg:w-[25%] p-6 lg:p-8 flex flex-col justify-center gap-3">
              <Button
                onClick={() => setShowRecords(!showRecords)}
                variant="outline"
                className={cn(
                  "rounded-xl font-bold h-11 transition-all",
                  showRecords &&
                    "bg-slate-800 text-white hover:bg-slate-700 border-slate-800",
                )}
              >
                <FileText size={16} className="mr-2" />
                রেকর্ডস
              </Button>
              <MedicalRecordsAddDialog appointmentId={appointment.id} />
            </div>
          </div>

          {/* মেডিকেল রেকর্ডস সেকশন (Expandable) */}
          {showRecords && (
            <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 mb-6">
                <h4 className="font-bold text-slate-800 dark:text-white">
                  সংযুক্ত ফাইলসমূহ
                </h4>
                <Badge className="bg-indigo-600">
                  {appointment.medicalRecords?.length || 0}
                </Badge>
              </div>

              {appointment.medicalRecords?.length ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {appointment.medicalRecords.map(
                    (record: any, index: number) => (
                      <div
                        key={record.id}
                        className="group/item relative aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in border dark:border-slate-700"
                      >
                        <Image
                          src={record.document}
                          alt={record.name}
                          fill
                          className="object-cover transition-transform group-hover/item:scale-105"
                          onClick={() =>
                            setViewerState((p) => ({
                              ...p,
                              isOpen: true,
                              currentIndex: index,
                            }))
                          }
                        />
                        <button className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all shadow-sm">
                          <Download size={12} className="text-slate-700" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-center py-6 text-sm text-slate-400 italic">
                  কোনো রেকর্ড পাওয়া যায়নি
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ImageViewerModal
        state={viewerState}
        zoomLevel={zoomLevel}
        onClose={() => setViewerState((prev) => ({ ...prev, isOpen: false }))}
        onNext={() =>
          setViewerState((p) => ({
            ...p,
            currentIndex: (p.currentIndex + 1) % p.appointment.length,
          }))
        }
        onPrev={() =>
          setViewerState((p) => ({
            ...p,
            currentIndex:
              (p.currentIndex - 1 + p.appointment.length) %
              p.appointment.length,
          }))
        }
        onZoomIn={() => setZoomLevel((prev) => Math.min(prev + 0.5, 4))}
        onZoomOut={() => setZoomLevel((prev) => Math.max(prev - 0.5, 1))}
        onSelectIndex={(index: any) =>
          setViewerState((prev) => ({ ...prev, currentIndex: index }))
        }
      />
    </>
  );
};
