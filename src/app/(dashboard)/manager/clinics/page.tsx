/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import ClinicDialog from "@/components/clinic/clinicDialog";
import LayoutLoader from "@/components/layout-loader";
import { IClinicResponse } from "@/interface/clinic";
import {
  useDeleteClinicMutation,
  useGetManagerClinicsQuery,
} from "@/redux/api/clinicApi"; // delete mutation যুক্ত করা হয়েছে

import { Building2, MapPin, Search, Store, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ClinicManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const [deactivate, setDeactivate] = useState("false");
  const [page, setPage] = useState(1);

  // ডিলিট মিউটেশন হুক
  const [deleteClinic] = useDeleteClinicMutation();

  const { data, isLoading } = useGetManagerClinicsQuery({
    searchTerm: searchTerm || undefined,
    deactivate: deactivate,
    page,
    limit: 12,
  });

  const clinics = data?.clinics || [];
  const meta = data?.meta;

  // ডিলিট হ্যান্ডলার ফাংশন
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই ক্লিনিকটি নিষ্ক্রিয় (Delete) করতে চান?",
    );
    if (confirmDelete) {
      try {
        await deleteClinic(id).unwrap();
        toast.success("ক্লিনিকটি সফলভাবে নিষ্ক্রিয় করা হয়েছে");
      } catch (err: any) {
        toast.error(err?.message || "ডিলিট করতে সমস্যা হয়েছে");
      }
    }
  };

  if (isLoading) return <LayoutLoader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
              আমার এরিয়ার ক্লিনিক
            </h1>
          </div>
          <ClinicDialog />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6">
        <div className="flex flex-col gap-4 mb-6">
          {/* ১. সার্চ বার এবং স্ট্যাটাস ফিল্টার */}
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="ক্লিনিকের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white shadow-sm rounded-2xl outline-none focus:ring-4 ring-emerald-500/5 border border-slate-100 focus:border-emerald-200 transition-all text-sm font-medium"
              />
            </div>

            {/* ২. কুইক স্ট্যাটাস টগল (সরাসরি সার্চের পাশে) */}
            <select
              value={deactivate}
              onChange={(e) => setDeactivate(e.target.value)}
              className="hidden sm:block px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none shadow-sm cursor-pointer hover:border-emerald-200 transition-all"
            >
              <option value="false">সক্রিয় (Active)</option>
              <option value="true">নিষ্ক্রিয় (Inactive)</option>
            </select>
          </div>

          {/* মোবাইলের জন্য স্ট্যাটাস ফিল্টার আলাদা রো-তে (ঐচ্ছিক) */}
          <div className="sm:hidden flex justify-end">
            <select
              value={deactivate}
              onChange={(e) => setDeactivate(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 outline-none"
            >
              <option value="false">Active Only</option>
              <option value="true">Show Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.length > 0 ? (
            clinics.map((clinic: IClinicResponse) => (
              <div
                key={clinic.id}
                className="group bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-tighter ${
                    clinic.user?.deactivate === true
                      ? "bg-rose-50 text-rose-500"
                      : "bg-emerald-50 text-emerald-500"
                  }`}
                >
                  {clinic.user?.deactivate === true ? "Inactive" : "Active"}
                </div>

                <div className="flex items-start gap-4">
                  {/* ইমেজ বা আইকন সেকশন */}
                  <div className="w-16 h-16 relative bg-gradient-to-br from-slate-50 to-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-black border border-emerald-100/50 group-hover:scale-105 transition-transform overflow-hidden">
                    {clinic.user?.image ? (
                      <Image
                        src={clinic.user.image}
                        alt={clinic.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Building2 size={30} />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                      {clinic.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {clinic.address}, {clinic.area?.name},{" "}
                        {clinic.area?.district?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Clinic Slug
                    </span>
                    <span className="text-[11px] font-black text-slate-700 truncate max-w-[130px]">
                      /{clinic.slug}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <ClinicDialog clinic={clinic} isEditMode={true} />

                    {/* ডিলিট বাটন */}
                    <button
                      onClick={() => handleDelete(clinic.id)}
                      className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      title="Delete Clinic"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <Store className="mx-auto text-slate-200 mb-3" size={48} />
              <p className="text-slate-400 font-bold italic">
                কোনো ক্লিনিক খুঁজে পাওয়া যায়নি
              </p>
            </div>
          )}
        </div>
        {meta && meta.totalPage > 1 && (
          <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
        )}
      </div>
    </div>
  );
}
