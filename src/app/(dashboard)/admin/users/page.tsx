/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import { useGetAreasQuery } from "@/redux/api/setup";
import { useGetUsersQuery, useUpdateUserRoleMutation } from "@/redux/api/user";
import {
  Loader2,
  MapPin,
  Power,
  PowerOff,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ROLES = ["ADMIN", "MANAGER", "DOCTOR", "PATIENT", "SUPPORT"];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignedAreaId, setAssignedAreaId] = useState("");

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    searchTerm,
    page,
    limit: 10,
  });

  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery(
    undefined,
    {
      skip: selectedRole !== "MANAGER",
    },
  );

  const [updateUserRole, { isLoading: isUpdating }] =
    useUpdateUserRoleMutation();

  // --- ১. Soft Delete / Toggle Status Logic ---
  const handleToggleStatus = async (user: any) => {
    const confirmMessage = user.deactivate
      ? `আপনি কি ${user.name}-কে আবার Active করতে চান?`
      : `আপনি কি ${user.name}-কে Deactivate করতে চান?`;

    if (!confirm(confirmMessage)) return;

    try {
      // এখানে role পাঠানোর প্রয়োজন নেই, শুধু id এবং deactivate স্ট্যাটাস যাবে
      await updateUserRole({
        id: user.id,
        deactivate: !user.deactivate,
      }).unwrap();

      toast.success(
        user.deactivate ? "ইউজার এখন অ্যাক্টিভ" : "ইউজার ডিঅ্যাক্টিভেট হয়েছে",
      );
    } catch (err: any) {
      toast.error(err?.message || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
    }
  };

  // --- ২. Modal Open Logic ---
  const openModal = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    // Manager মডেল থেকে areaId নিয়ে আসা
    setAssignedAreaId(user.manager?.areaId || "");
    setIsModalOpen(true);
  };

  // --- ৩. Role & Area Update Logic ---
  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === "MANAGER" && !assignedAreaId) {
      toast.error("অনুগ্রহ করে একটি এরিয়া নির্বাচন করুন");
      return;
    }

    try {
      const payload = {
        id: selectedUser.id,
        role: selectedRole,
        // ম্যানেজার হলে এরিয়া আইডি যাবে, না হলে নাল
        assignedAreaId: selectedRole === "MANAGER" ? assignedAreaId : null,
      };

      await updateUserRole(payload).unwrap();
      toast.success(`${selectedUser.name}-এর রোল আপডেট হয়েছে`);
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "আপডেট করা সম্ভব হয়নি");
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 min-h-screen font-sans">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" /> ইউজার কন্ট্রোল প্যানেল
          </h1>
          <p className="text-slate-500 text-sm">
            রোল পরিবর্তন এবং ইউজার স্ট্যাটাস নিয়ন্ত্রণ করুন
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ইউজার তথ্য
                </th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  বর্তমান রোল
                </th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ম্যানেজড এরিয়া
                </th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isUsersLoading ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-3" size={32} />{" "}
                    ডাটা লোড হচ্ছে...
                  </td>
                </tr>
              ) : (
                usersData?.users?.map((user: any) => (
                  <tr
                    key={user.id}
                    className={`transition-colors group ${user.deactivate ? "bg-red-50/30 grayscale-[0.5]" : "hover:bg-slate-50/50"}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold border uppercase ${user.deactivate ? "bg-red-100 text-red-600 border-red-200" : "bg-blue-100 text-blue-700 border-blue-200"}`}
                        >
                          {user.name[0]}
                        </div>
                        <div>
                          <div
                            className={`font-bold ${user.deactivate ? "text-red-900" : "text-slate-800"}`}
                          >
                            {user.name}{" "}
                            {user.deactivate && (
                              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded ml-2">
                                DISABLED
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-full ${user.role === "ADMIN" ? "bg-red-50 text-red-700" : user.role === "MANAGER" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        <ShieldCheck size={14} /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.role === "MANAGER" ? (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-emerald-500" />
                          {user?.manager?.area ? (
                            <span className="text-slate-700 font-medium">
                              {user.manager.area.name}{" "}
                              <span className="text-slate-400 text-xs">
                                ({user.manager.area.district?.name})
                              </span>
                            </span>
                          ) : (
                            <span className="text-red-400 italic text-sm">
                              No Area Assigned
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right flex justify-end gap-2">
                      {/* --- Deactivate Button --- */}
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={
                          user.deactivate ? "Activate User" : "Deactivate User"
                        }
                        className={`p-2 rounded-xl border transition shadow-sm ${user.deactivate ? "bg-red-600 border-red-600 text-white hover:bg-red-700" : "bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100"}`}
                      >
                        {user.deactivate ? (
                          <Power size={18} />
                        ) : (
                          <PowerOff size={18} />
                        )}
                      </button>

                      {/* --- Edit Role Button --- */}
                      <button
                        onClick={() => openModal(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:border-blue-500 transition shadow-sm"
                      >
                        <UserCog size={16} className="text-blue-600" /> এডিট
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {usersData?.meta?.totalPage && usersData.meta.totalPage > 1 && (
          <AppPagination
            meta={usersData.meta}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isUpdating && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 pb-4 flex justify-between items-center bg-slate-50 border-b">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  ম্যানেজমেন্ট সেটিং
                </h2>
                <p className="text-sm text-slate-500">{selectedUser?.name}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="p-8 pt-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase">
                  রোল নির্বাচন
                </label>
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-semibold"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole === "MANAGER" && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />{" "}
                    দায়িত্বপ্রাপ্ত এলাকা (Area)
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-semibold"
                    value={assignedAreaId}
                    onChange={(e) => setAssignedAreaId(e.target.value)}
                  >
                    <option value="">এরিয়া সিলেক্ট করুন...</option>
                    {isAreaLoading ? (
                      <option disabled>Loading Areas...</option>
                    ) : (
                      areaData?.areas?.map((area: any) => (
                        <option key={area.id} value={area.id}>
                          {area.name} ({area.district?.name})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 ${
                  selectedRole === "MANAGER"
                    ? "bg-emerald-600 shadow-emerald-100"
                    : "bg-slate-900 shadow-slate-100"
                } disabled:bg-slate-300`}
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
                {isUpdating ? "আপডেট হচ্ছে..." : "রোল ও এরিয়া সেভ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
