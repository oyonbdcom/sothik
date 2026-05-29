/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import DiagnosticDialog from "@/components/diagnostic/diagnosticDialog";
import LayoutLoader from "@/components/layout-loader";
import { IDiagnosticResponse } from "@/interface/diagnostic";
import {
  useDeleteDiagnosticsMutation,
  useGetDiagnosticsQuery,
} from "@/redux/api/diagnosticApi";

import { useGetAreasQuery, useGetDistrictsQuery } from "@/redux/api/setup"; // Setup API যুক্ত করা হয়েছে
import { skipToken } from "@reduxjs/toolkit/query";

import { Building2, MapPin, Search, Store, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DiagnosticManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deactivate, setDeactivate] = useState("false");

  // নতুন ফিল্টার স্টেট
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [page, setPage] = useState(1);
  // ১. জেলা এবং এরিয়া ডাটা ফেচিং
  const { data: distData } = useGetDistrictsQuery(undefined);
  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery(
    selectedDistrict || skipToken,
  );

  const [deleteDiagnostic] = useDeleteDiagnosticsMutation();

  // ২. ফিল্টারসহ ক্লিনিক ডাটা ফেচিং
  const { data, isLoading } = useGetDiagnosticsQuery({
    searchTerm: searchTerm || undefined,
    deactivate: deactivate,
    district: selectedDistrict || undefined, // API-তে district সাপোর্ট থাকলে
    area: selectedArea || undefined, // API-তে area সাপোর্ট থাকলে
    page: page,
    limit: 12,
  });

  const diagnostics = data?.diagnostics || [];

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই ডাইগনস্টিকটি নিষ্ক্রিয় করতে চান?",
    );
    if (confirmDelete) {
      try {
        await deleteDiagnostic(id).unwrap();
        toast.success("ডাইগনস্টিকটি সফলভাবে নিষ্ক্রিয় করা হয়েছে");
      } catch (err: any) {
        toast.error(err?.message || "ডিলিট করতে সমস্যা হয়েছে");
      }
    }
  };

  if (isLoading) return <LayoutLoader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
            আমার এরিয়ার ডাইগনস্টিক
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6">
        <div className="flex flex-col gap-4 mb-8">
          {/* সার্চ এবং মেইন ফিল্টার রো */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500"
                size={18}
              />
              <input
                type="text"
                placeholder="ডাইগনস্টিককের নাম দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white shadow-sm rounded-2xl outline-none border border-slate-100 focus:border-emerald-200 transition-all text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {/* জেলা ফিল্টার */}
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedArea(""); // জেলা বদলালে এরিয়া রিসেট
                }}
                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none shadow-sm min-w-[120px]"
              >
                <option value="">সকল জেলা</option>
                {distData?.districts?.map((d: any) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* এরিয়া ফিল্টার */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedDistrict}
                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none shadow-sm min-w-[120px] disabled:opacity-50"
              >
                <option value="">
                  {isAreaLoading ? "লোড হচ্ছে..." : "সকল এরিয়া"}
                </option>
                {areaData?.areas?.map((a: any) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>

              {/* স্ট্যাটাস ফিল্টার */}
              <select
                value={deactivate}
                onChange={(e) => setDeactivate(e.target.value)}
                className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none shadow-sm"
              >
                <option value="false">সক্রিয়</option>
                <option value="true">নিষ্ক্রিয়</option>
              </select>
            </div>
          </div>
        </div>

        {/* ক্লিনিক কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnostics.length > 0 ? (
            diagnostics.map((diagnostic: IDiagnosticResponse) => (
              <div
                key={diagnostic?.id}
                className="group rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100 hover:shadow-lg"
              >
                {/* top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* image */}
                    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-emerald-50 text-emerald-600">
                      {diagnostic.user?.image ? (
                        <Image
                          src={diagnostic.user.image}
                          alt={diagnostic.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Building2 size={24} />
                      )}
                    </div>

                    {/* info */}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-800">
                        {diagnostic.user?.name}
                      </h3>

                      <p className="mt-1 flex items-start gap-1 text-[11px] text-slate-500">
                        <MapPin size={12} className="mt-0.5 shrink-0" />

                        <span className="line-clamp-2">
                          {diagnostic.address}, {diagnostic.area?.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* status */}
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      diagnostic?.user?.deactivate
                        ? "bg-rose-100 text-rose-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {diagnostic?.user?.deactivate ? "Inactive" : "Active"}
                  </span>
                </div>

                {/* bottom */}
                <div className=" flex items-center justify-between gap-2    ">
                  <p className="mt-1 text-[10px] font-medium text-slate-400">
                    /{diagnostic?.slug}
                  </p>
                  <div className="flex items-center gap-2">
                    {" "}
                    <DiagnosticDialog diagnostic={diagnostic} isEditMode />
                    <button
                      onClick={() => handleDelete(diagnostic?.id)}
                      className="rounded-xl bg-rose-50   text-rose-500 transition-all "
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
                কোনো ডাইগনস্টিক খুঁজে পাওয়া যায়নি
              </p>
            </div>
          )}
        </div>
        <AppPagination meta={data?.meta} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}
