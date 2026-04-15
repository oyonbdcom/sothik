/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// নতুন Mutation হুকটি ইমপোর্ট করুন (আপনার API ফাইল অনুযায়ী নাম ঠিক করে নিন)
import { IMembershipResponse } from "@/interface/clinic-membership";
import { IScheduleResponse } from "@/interface/schedule";
import { enToBnNumber } from "@/lib/utils/utils";
import { useGetAllClinicsForManagerQuery } from "@/redux/api/clinicApi";
import { useGetAllDoctorForManagerQuery } from "@/redux/api/doctorApi";
import {
  useDeleteMembershipMutation,
  useGetMembershipsQuery,
} from "@/redux/api/membershipApi";
import { useDeleteScheduleMutation } from "@/redux/api/scheduleApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import MembershipPro from "./components/membership-create";
import ScheduleModal from "./components/schedule-modal";

export default function MembershipMainPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clinicId, setClinicId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [editingMembership, setEditingMembership] =
    useState<IMembershipResponse | null>(null);

  const [editingSchedule, setEdithingSchedule] =
    useState<IScheduleResponse | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | null
  >(null);

  const [page, setPage] = useState(1);

  // redux
  const { data, isLoading, isError } = useGetMembershipsQuery({
    clinicId,
    doctorId,
    page: page,
    limit: 10,
  });
  const { data: allClinics, isLoading: allClinicLoading } =
    useGetAllClinicsForManagerQuery();
  const { data: allDoctors, isLoading: allDoctorLoading } =
    useGetAllDoctorForManagerQuery();

  const [deleteMembership, { isLoading: isDeleting }] =
    useDeleteMembershipMutation();
  const memberships = data?.membership || [];

  const [deleteSchedule, { isLoading: isScheduleDeleting }] =
    useDeleteScheduleMutation();

  // controller
  const handleEdit = (item: IMembershipResponse) => {
    setEditingMembership(item); // ডাটা সেট করুন
    setIsDrawerOpen(true); // ড্রয়ার ওপেন করুন
  };
  const handleDelete = (id: string) => {
    deleteMembership(id);
  };
  const handleEditSchedule = (item: IScheduleResponse) => {
    setEdithingSchedule(item);
    setIsModalOpen(true);
  };
  const handleDeleteSchedule = (id: string) => {
    deleteSchedule(id);
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="mt-2 text-slate-500 font-medium">লোড হচ্ছে...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 relative overflow-x-hidden">
      {/* ১. হেডার */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            সদস্যপদ
          </h1>
          <p className="text-[10px] font-bold text-slate-400">
            Manage Doctor Schedules
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex gap-4 p-4">
        <select
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
          className="px-3 py-2 rounded-xl border text-xs"
        >
          <option value="">সব ক্লিনিক</option>
          {allClinics?.clinics?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
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
      </div>
      {/* ২. মেম্বারশিপ লিস্ট */}
      <div className="p-5 space-y-4">
        {memberships.length > 0 ? (
          memberships.map((item: IMembershipResponse) => (
            <div
              key={item.id}
              className="bg-white rounded-[20px] p-3 border border-slate-100 shadow-sm"
            >
              {/* উপরের অংশ: ডাক্তার এবং ফি */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Stethoscope size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-[14px] truncate leading-tight">
                      {item.doctor?.user?.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">
                      {item?.doctor?.department?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* ফি সেকশন */}
                  <div className="text-right flex flex-col items-end mr-1">
                    <div className="flex items-center gap-1 px-1 py-0.5 rounded-md bg-white/90 backdrop-blur text-emerald-700 border border-emerald-100 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        ফি {enToBnNumber(item?.fee)} টাকা
                      </span>
                    </div>
                  </div>

                  {/* এডিট বাটন */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-slate-100 transition-all active:scale-90 group"
                    title="Edit"
                  >
                    <Edit3
                      size={14}
                      className="transition-transform group-hover:rotate-12"
                    />
                  </button>

                  {/* ডিলিট বাটন উইথ লোডিং */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className={`p-2 rounded-lg border transition-all active:scale-90 group ${
                      isDeleting
                        ? "bg-slate-50 border-slate-100 text-slate-300"
                        : "bg-white border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                    }`}
                    title="Delete"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* ক্লিনিকের নাম - এক লাইনে ছোট করে */}
              <div className="flex items-center gap-1 mb-3 text-slate-500 text-[10px] font-bold">
                <MapPin size={10} className="text-slate-400" />
                <span className="truncate">{item.clinic?.name}</span>
              </div>

              {/* সেশন সেকশন - বর্ডারলেস এবং কম্প্যাক্ট */}
              <div className="bg-slate-50/50 rounded-xl p-2 space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    সেশন
                  </span>
                  <button
                    onClick={() => {
                      setSelectedMembershipId(item.id);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 flex items-center gap-0.5 text-[10px] font-bold hover:underline"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>

                {/* সেশন লিস্ট - হরিজন্টাল বা গ্রিড আকারে ছোট করে */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {item?.schedules && item?.schedules?.length > 0 ? (
                    item.schedules.map((sch: IScheduleResponse) => (
                      <div
                        key={sch.id}
                        // ১. এখানে 'group' ক্লাসটি যুক্ত করা হয়েছে
                        className="group flex items-center justify-between bg-slate-50 border border-slate-100 p-1.5 rounded-xl hover:border-emerald-200 hover:bg-white hover:shadow-sm transition-all"
                      >
                        {/* সময় */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                          <Clock size={12} className="text-emerald-500" />
                          <span>{sch.time}</span>
                        </div>

                        {/* অ্যাকশন বাটনসমূহ - এখন হোভার করলে ঠিকঠাক কাজ করবে */}
                        <div className="flex items-center gap-1   transition-opacity">
                          <button
                            onClick={() => handleEditSchedule(sch)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-md transition-all"
                          >
                            <Edit3 size={10} />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sch.id)}
                            disabled={isScheduleDeleting}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all disabled:opacity-50"
                          >
                            {isScheduleDeleting ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Trash2 size={10} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex items-center gap-2 py-2 px-1 text-slate-400 italic text-[10px]">
                      <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                      শিডিউল সেট করা নেই
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            কোনো ডাটা পাওয়া যায়নি
          </div>
        )}
      </div>
      {/* ৫. মেম্বারশিপ লিস্টের নিচে এই অংশটুকু বসান */}
      {memberships.length > 0 && data?.meta && (
        <div className="px-5 py-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 disabled:opacity-40 disabled:bg-slate-50 transition-all active:scale-90 shadow-sm"
            >
              <span className="sr-only">Previous</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              {[...Array(data.meta.totalPage || 1)].map((_, index) => {
                const pageNum = index + 1;
                // শুধুমাত্র বর্তমান পেজ, তার আগের এবং পরের পেজ দেখানোর জন্য (যদি পেজ সংখ্যা অনেক বেশি হয়)
                if (
                  pageNum === 1 ||
                  pageNum === data?.meta?.totalPage ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`min-w-[36px] h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        page === pageNum
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-300">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              disabled={page >= (data?.meta?.totalPage || 1)}
              onClick={() => setPage((prev) => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 disabled:opacity-40 disabled:bg-slate-50 transition-all active:scale-90 shadow-sm"
            >
              <span className="sr-only">Next</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* ৩. শিডিউল অ্যাড করার মোডাল */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMembershipId={selectedMembershipId}
        initialData={editingSchedule}
      />

      {/* ৪. মেইন ড্রয়ার */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="relative h-full bg-[#F8FAFC] shadow-2xl flex flex-col z-[110] w-[95%] md:w-[500px]"
            >
              <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white">
                <h2 className="text-slate-800 font-black text-sm uppercase">
                  নতুন মেম্বারশিপ
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-slate-50 text-slate-400 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <MembershipPro
                  onClose={() => setIsDrawerOpen(false)}
                  initialData={editingMembership}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
