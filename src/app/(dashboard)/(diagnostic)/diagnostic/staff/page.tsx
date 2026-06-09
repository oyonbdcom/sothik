/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/loader";
import {
  useDeleteStaffMutation,
  useGetAllStaffQuery,
} from "@/redux/api/staffApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AddStaffDialog from "../../components/add-staf-dialog";

export default function StaffManagement() {
  const { data: staffList, isLoading: isStaffLoading } =
    useGetAllStaffQuery(undefined);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const handleDelete = async (staffId: string) => {
    const isConfirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই স্টাফ মুছে ফেলতে চান?",
    );
    if (!isConfirmed) return;

    try {
      await deleteStaff(staffId).unwrap();
      toast.success("স্টাফ সফলভাবে মুছে ফেলা হয়েছে");
    } catch (error: any) {
      toast.error(error?.message || "মুছে ফেলতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="p-6 space-y-5">
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">স্টাফদের কার্যক্রম</h3>
          <button className="text-xs font-medium text-blue-600">
            সব দেখুন
          </button>
        </div>

        {/* CONTAINER CONTENT AREA */}
        <div className="space-y-4">
          {isStaffLoading ? (
            /* Sub-context Inline Loader: Keeps panel shape intact while syncing records */
            <Loader />
          ) : staffList?.data && staffList?.data?.length > 0 ? (
            staffList.data.map((staff: any) => {
              return (
                <div
                  key={staff.id}
                  className="flex flex-col gap-3 p-4 border border-slate-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4 md:border-0 md:border-b md:border-slate-100 md:py-4 md:px-2 md:rounded-xl md:bg-transparent md:shadow-none md:hover:bg-slate-50/50"
                >
                  {/* IDENTITY BLOCK */}
                  <div className="flex items-start gap-3.5 md:col-span-7 md:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-base font-bold text-blue-600 border border-blue-100 shadow-sm md:h-12 md:w-12">
                      {staff?.user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800 leading-none">
                          {staff?.user?.name || "অজানা স্টাফ"}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            staff?.staffType === "COORDINATOR"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}
                        >
                          {staff?.staffType === "COORDINATOR"
                            ? "কো-অর্ডিনেটর"
                            : "রিসেপশনিস্ট"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-slate-500 font-medium tracking-wide">
                          {staff?.user?.phoneNumber || "মোবাইল নম্বর নেই"}
                        </p>
                        {staff?.assignedDoctor?.user?.name && (
                          <p className="inline-flex items-center text-[11px] font-medium text-slate-400 mt-1 md:mt-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                            ডাক্তার:{" "}
                            <span className="text-slate-600 font-semibold ml-1">
                              {staff.assignedDoctor.user.name}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 md:hidden" />

                  {/* BOTTOM INFO ROW */}
                  <div className="flex items-center justify-between mt-1 md:mt-0 md:col-span-5 md:grid md:grid-cols-5 md:items-center">
                    {/* INTERACTION UTILITIES */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100 md:bg-transparent md:border-0 md:p-0 md:col-span-2 md:justify-end md:border-l md:border-slate-100 md:pl-4 md:h-9">
                      <AddStaffDialog staff={staff} />
                      <button
                        onClick={() => handleDelete(staff.id)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50/80 transition-all active:scale-90 disabled:opacity-40"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-sm text-gray-400">
              কোনো স্টাফ পাওয়া যায়নি
            </div>
          )}
        </div>
      </section>

      {/* FOOTER ACTIONS FRAME */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <AddStaffDialog />
      </div>
    </div>
  );
}
