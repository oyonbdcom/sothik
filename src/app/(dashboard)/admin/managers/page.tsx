/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import {
  useGetManagersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/api/user";
import {
  Loader2,
  MapPin,
  Phone,
  Power,
  Search,
  ShieldCheck,
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
    <div className="relative     space-y-6 min-h-screen bg-slate-50/30 font-sans">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
        </div>
      </div>

      {/* --- Main Content --- */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : (
        <>
          <div>
            {managersData?.managers?.map((manager: any) => (
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
                    </div>
                    <p className="text-xs text-blue-500 font-medium flex items-center gap-1">
                      <Phone size={12} /> {manager.user?.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8 text-sm">
                  <p>
                    <span className="text-slate-400">ডায়াগনস্টিক:</span>{" "}
                    <b>{manager.area?._count?.diagnostics || 0}</b>
                  </p>
                  <p>
                    <span className="text-slate-400">ডাক্তার:</span>{" "}
                    <b>{manager.area?._count?.doctors || 0}</b>
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(manager)}
                  className={`p-2 rounded-xl transition-colors ${manager.user?.deactivate ? "bg-red-500 text-white" : "bg-slate-50 text-slate-300 hover:text-red-500"}`}
                >
                  <Power size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {meta?.totalPage && meta.totalPage > 1 && (
            <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
          )}
        </>
      )}
    </div>
  );
}
