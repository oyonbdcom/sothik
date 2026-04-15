/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import {
  useGetManagersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/api/user";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Phone,
  Power,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCircle2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ManagerManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedManager, setSelectedManager] = useState<any>(null);

  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: managersData, isLoading } = useGetManagersQuery({
    searchTerm: searchTerm,
    page: page,
    limit: limit,
  });

  const [updateUserRole] = useUpdateUserRoleMutation();

  // মেটা ডাটা (ব্যাকএন্ড থেকে আসা)
  const meta = managersData?.meta;

  const handleToggleStatus = async (manager: any) => {
    const isDeactivated = manager.user?.deactivate;
    const action = isDeactivated ? "Active" : "Deactivate";

    if (!confirm(`আপনি কি এই ম্যানেজারকে ${action} করতে চান?`)) return;

    try {
      await updateUserRole({
        id: manager.user?.id,
        deactivate: !isDeactivated,
      }).unwrap();
      toast.success(`ম্যানেজার এখন ${isDeactivated ? "সচল" : "বন্ধ"}`);
    } catch (err: any) {
      toast.error("আপডেট করা সম্ভব হয়নি");
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto p-4 md:p-8 space-y-6 min-h-screen bg-slate-50/30 font-sans">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <ShieldCheck className="text-emerald-600" size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              ম্যানেজার লিস্ট
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-1">
            মোট ম্যানেজার: {meta?.total || 0} জন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="খুঁজুন..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // সার্চ করলে প্রথম পেজে ফিরে যাবে
              }}
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${viewMode === "table" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : ""
            }
          >
            {managersData?.managers?.map((manager: any) =>
              viewMode === "grid" ? (
                <div
                  key={manager.id}
                  className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl transition-all group animate-in fade-in zoom-in duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">
                      {manager.user?.name[0]}
                    </div>
                    <button
                      onClick={() => handleToggleStatus(manager)}
                      className={`p-2 rounded-xl transition-colors ${manager.user?.deactivate ? "bg-red-500 text-white" : "bg-slate-50 text-slate-300 hover:text-red-500"}`}
                    >
                      <Power size={16} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {manager.user?.name}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1 mb-6">
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin size={14} className="text-emerald-500" />{" "}
                      {manager.area?.name || "N/A"}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                      <Phone size={14} className="text-blue-500" />{" "}
                      {manager.user?.phoneNumber || "No Phone"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center">
                      <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                        ক্লিনিক
                      </p>
                      <p className="text-xl font-black text-blue-700">
                        {manager.area?._count?.clinics || 0}
                      </p>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        ডাক্তার
                      </p>
                      <p className="text-xl font-black text-emerald-700">
                        {manager.area?._count?.doctors || 0}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedManager(manager)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
                  >
                    বিস্তারিত দেখুন <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div
                  key={manager.id}
                  className="bg-white p-4 mb-2 rounded-2xl border flex items-center justify-between px-8 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">
                      {manager.user?.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{manager.user?.name}</p>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {manager.area?.name}
                        </p>
                        <p className="text-xs text-blue-500 font-medium flex items-center gap-1">
                          <Phone size={12} /> {manager.user?.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8 text-sm">
                    <p>
                      <span className="text-slate-400">ক্লিনিক:</span>{" "}
                      <b>{manager.area?._count?.clinics || 0}</b>
                    </p>
                    <p>
                      <span className="text-slate-400">ডাক্তার:</span>{" "}
                      <b>{manager.area?._count?.doctors || 0}</b>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedManager(manager)}
                    className="p-2 bg-slate-50 rounded-lg hover:bg-emerald-50 text-emerald-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ),
            )}
          </div>

          {/* --- Pagination Controls --- */}
          {meta?.totalPage && meta.totalPage > 1 && (
            <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
          )}
        </>
      )}

      {/* --- Details Side Drawer (Selected Manager) --- */}
      {selectedManager && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedManager(null)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
            <button
              onClick={() => setSelectedManager(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {selectedManager.user?.name}
              </h2>
              <p className="text-slate-500 flex items-center gap-2 italic">
                <MapPin size={16} /> {selectedManager.area?.name},{" "}
                {selectedManager.area?.district?.name}
              </p>
            </div>

            <div className="space-y-8">
              {/* ক্লিনিক তালিকা */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold border-b pb-2 uppercase text-xs tracking-widest">
                  <Building2 size={18} /> ক্লিনিকে তালিকা (
                  {selectedManager.area?._count?.clinics || 0})
                </div>
                <div className="space-y-2">
                  {/* আপনার ব্যাকএন্ড include: { area: { include: { clinics: true } } } অনুযায়ী */}
                  {selectedManager.area?.clinics?.length > 0 ? (
                    selectedManager.area.clinics.map((clinic: any) => (
                      <div
                        key={clinic.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <p className="text-sm font-bold text-slate-700">
                          {clinic.name}
                        </p>
                        <span className="text-[10px] bg-white px-2 py-1 rounded-md border text-slate-400 uppercase">
                          Clinic
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      কোন ক্লিনিক যুক্ত নেই
                    </p>
                  )}
                </div>
              </div>

              {/* ডাক্তার তালিকা */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold border-b pb-2 uppercase text-xs tracking-widest">
                  <Stethoscope size={18} /> ডাক্তার তালিকা (
                  {selectedManager.area?._count?.doctors || 0})
                </div>
                <div className="space-y-2">
                  {selectedManager.area?.doctors?.length > 0 ? (
                    selectedManager.area.doctors.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border text-emerald-500">
                          <UserCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {doc.doctor?.user?.name || "ডাক্তারের নাম নেই"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {doc.doctor?.specialization || "General"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      কোন ডাক্তার যুক্ত নেই
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
