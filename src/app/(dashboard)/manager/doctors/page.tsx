/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import LayoutLoader from "@/components/layout-loader";
import { IDoctorResponse } from "@/interface/doctor";
import {
  useAddDoctorToAreaMutation,
  useGetDoctorsQuery,
  useRemoveDoctorFromAreaMutation,
} from "@/redux/api/doctorApi";
import {
  useGetAreasQuery,
  useGetDepartmentsQuery,
  useGetDistrictsQuery,
} from "@/redux/api/setup";
import {
  Filter,
  Search,
  Star,
  Stethoscope,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import DoctorDialog from "../../../../components/doctor/doctor-dialog";

export default function DoctorManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [district, setDistrict] = useState(""); // জেলা স্লাগ
  const [area, setArea] = useState(""); // এরিয়া স্লাগ
  const [gender, setGender] = useState("");
  const [minRating, setMinRating] = useState("");
  const [deactivate, setDeactivate] = useState("false");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [addDoctorToArea] = useAddDoctorToAreaMutation();
  const [removeDoctorFromArea] = useRemoveDoctorFromAreaMutation();

  // --- API Queries for Select Options ---
  const { data: deptData } = useGetDepartmentsQuery(undefined);
  const { data: distData } = useGetDistrictsQuery(undefined);
  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery(
    district,
    {
      skip: !district, // জেলা সিলেক্ট না করলে এরিয়া কুয়েরি হবে না
    },
  );

  const departments = deptData?.departments || [];
  const districts = distData?.districts || [];
  const areas = areaData?.areas || [];

  // জেলা পরিবর্তন করলে এরিয়া রিসেট করা
  // useEffect(() => {
  //   setArea("");
  // }, [district]);

  // --- Main API Call for Doctors ---
  const { data, isLoading } = useGetDoctorsQuery({
    searchTerm: searchTerm || undefined,
    department: department || undefined, // slug
    area: area || undefined, // slug
    district: district || undefined, // slug
    gender: gender || undefined,
    minRating: minRating || undefined,
    deactivate: deactivate,
    myAreaOnly: activeTab === "my" ? "true" : undefined,
    page: page,
    limit: 12,
  });

  const doctors = data?.doctors || [];

  const handleAddDoctor = async (id: string) => {
    try {
      await addDoctorToArea(id).unwrap();
      toast.success("ডাক্তারকে আপনার এরিয়াতে যুক্ত করা হয়েছে");
    } catch (err: any) {
      toast.error(err?.message || "যুক্ত করতে সমস্যা হয়েছে");
    }
  };

  const handleRemoveDoctor = async (id: string) => {
    const isConfirmed = window.confirm(
      "আপনি কি নিশ্চিতভাবে এই ডাক্তারকে আপনার এরিয়া থেকে রিমুভ করতে চান?",
    );
    if (isConfirmed) {
      try {
        await removeDoctorFromArea(id).unwrap();
        toast.success("সফলভাবে সরানো হয়েছে");
      } catch (err: any) {
        toast.error(err?.message || "রিমুভ করতে সমস্যা হয়েছে");
      }
    }
  };

  if (isLoading) return <LayoutLoader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
              ডাক্তার তালিকা
            </h1>
            <p className="text-[10px] md:text-sm text-slate-500 font-medium mt-1 uppercase tracking-wider">
              SusthiO Management
            </p>
          </div>
          <DoctorDialog />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6">
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-6 w-full max-w-md mx-auto shadow-inner border border-slate-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.2rem] text-xs font-black transition-all ${activeTab === "all" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
          >
            <Users size={16} /> সব ডাক্তার
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1.2rem] text-xs font-black transition-all ${activeTab === "my" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
          >
            <UserCheck size={16} /> আমার এরিয়া
          </button>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="নাম বা স্পেশালাইজেশন দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white shadow-sm rounded-2xl outline-none border border-slate-100 transition-all text-sm font-medium focus:ring-2 ring-emerald-500/10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 rounded-2xl border transition-all ${showFilters ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* --- Dynamic Filters Area --- */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-hidden transition-all duration-300 ${showFilters ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0 pointer-events-none"}`}
        >
          {/* Department (Slug) */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
          >
            <option value="">সব ডিপার্টমেন্ট</option>
            {departments.map((dept: any) => (
              <option key={dept.id} value={dept.slug}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* District (Slug) */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
          >
            <option value="">সব জেলা</option>
            {districts.map((dist: any) => (
              <option key={dist.id} value={dist.slug}>
                {dist.name}
              </option>
            ))}
          </select>

          {/* Area (Slug) */}
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            disabled={!district}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm disabled:opacity-50"
          >
            <option value="">
              {isAreaLoading ? "লোড হচ্ছে..." : "সব এরিয়া"}
            </option>
            {areas.map((a: any) => (
              <option key={a.id} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
          >
            <option value="">সব লিঙ্গ</option>
            <option value="MALE">পুরুষ</option>
            <option value="FEMALE">মহিলা</option>
          </select>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
          >
            <option value="">সব রেটিং</option>
            <option value="4.5">৪.৫+</option>
            <option value="4.0">৪.০+</option>
          </select>

          <select
            value={deactivate}
            onChange={(e) => setDeactivate(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 outline-none shadow-sm"
          >
            <option value="false">Active</option>
            <option value="true">Deactivated</option>
          </select>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.length > 0 ? (
            doctors.map((doc: IDoctorResponse) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm relative group"
              >
                <div className="flex gap-3">
                  {/* প্রোফাইল ইমেজ - সাইজ কমিয়ে ৪৮ (12) করা হয়েছে */}
                  <div className="relative w-12 h-12 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-emerald-50">
                    {doc.user.image ? (
                      <Image
                        src={doc.user.image}
                        alt={doc.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700 text-lg uppercase">
                        {doc.user.name[0]}
                      </div>
                    )}
                  </div>

                  {/* টেক্সট কন্টেন্ট */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate leading-none">
                      {doc.user.name}
                    </h3>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1 truncate">
                      {doc.specialization}
                    </p>

                    {/* রেটিং - আরও ছোট এবং ক্লিন */}
                    <div className="flex items-center gap-1  text-amber-600 font-bold text-[10px]">
                      <Star size={10} fill="currentColor" />
                      {doc.averageRating.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* নিচের অংশ - স্পেসিং কমিয়ে আনা হয়েছে */}
                <div className="pt-3 border-t border-dashed border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[100px]">
                    {doc.department?.name || "General"}
                  </span>

                  <div className="flex gap-1.5">
                    {activeTab === "all" ? (
                      <>
                        <DoctorDialog doctor={doc} isEditMode={true} />
                        <button
                          onClick={() => handleAddDoctor(doc.id)}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <UserPlus size={14} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRemoveDoctor(doc.id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
              <Stethoscope className="mx-auto text-slate-200 mb-3" size={48} />
              <p className="text-slate-400 font-bold italic">
                কোনো ডাক্তার পাওয়া যায়নি
              </p>
            </div>
          )}
        </div>

        <AppPagination meta={data?.meta} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}
