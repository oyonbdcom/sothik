/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Activity,
  ArrowLeft,
  Award,
  Building,
  Calendar,
  CheckCircle,
  ChevronRight,
  Filter,
  Loader2,
  Percent,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IDoctorResponse } from "@/interface/doctor";
import { createClinicMembershipSchema } from "@/zod-validation/membership";

import { Badge } from "@/components/ui/badge";
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
import { CreateMembershipInput } from "@/interface/clinic-membership";
import { getDepartmentLabel } from "@/lib/utils/utils";
import { useGetDoctorsQuery } from "@/redux/api/doctorApi";
import { useCreateMembershipMutation } from "@/redux/api/membershipApi";

interface AddDoctorMembershipProps {
  handleBackToList: () => void;
}

export function AddDoctorMembership({
  handleBackToList,
}: AddDoctorMembershipProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateMembershipInput>({
    resolver: zodResolver(createClinicMembershipSchema),
    defaultValues: {
      doctorId: "",
      maxAppointments: undefined,
      discount: undefined,
      fee: undefined,
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [district, setDistrict] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");

  const query = {
    active: true,
    ...(searchTerm && { searchTerm }),

    ...(district !== "all" && { district }),
    ...(gender !== "all" && { gender }),
    ...(department !== "all" && { department }),
  };

  const { data, isLoading: isFetchingDoctors } = useGetDoctorsQuery(query);
  const doctors = data?.doctors ?? [];

  const [createMembership] = useCreateMembershipMutation();

  const handleSelectDoctor = (doctor: IDoctorResponse) => {
    setSelectedDoctor(doctor);
    form.setValue("doctorId", doctor.id);

    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 800, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedDoctor) {
      toast.error("অনুগ্রহ করে আগে একজন ডাক্তার নির্বাচন করুন");
      return;
    }

    // ডেটা টাইপ ফিক্স করা (String to Number)
    const payload = {
      ...data,
      fee: data.fee,
      maxAppointments: data.maxAppointments,
      discount: data.discount,
      doctorId: selectedDoctor.id,
    };

    startTransition(async () => {
      try {
        await createMembership(payload).unwrap();
        toast.success("সফলভাবে ডাক্তার যুক্ত করা হয়েছে!");
        handleBackToList();
      } catch (error: any) {
        toast.error(error?.message || "ডাক্তার যুক্ত করতে ব্যর্থ হয়েছে");
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("all");
    setGender("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <div
            className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 
      rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row   md:items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="rounded-full w-16 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md 
        hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1
                    className="text-sm md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 
          bg-clip-text text-transparent"
                  >
                    মেম্বারশিপে ডাক্তার যুক্ত করুন
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    আপনার ক্লিনিক মেম্বারশিপে যুক্ত করতে ডাক্তার খুঁজুন এবং
                    নির্বাচন করুন
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
        rounded-full border border-blue-200 dark:border-blue-700"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    সুরক্ষিত প্রক্রিয়া
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Search & Filters */}
            <div className="lg:col-span-2 space-y-6">
              {/* অনুসন্ধান কার্ড (Search Card) */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                          চিকিৎসক খুঁজুন (Find Doctors)
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          নাম, বিশেষজ্ঞতা বা অবস্থান দিয়ে অনুসন্ধান করুন
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2 rounded-full border-blue-200 dark:border-blue-800"
                    >
                      <Filter className="w-4 h-4" />
                      {showFilters ? "ফিল্টার লুকান" : "ফিল্টার দেখান"}
                    </Button>
                  </div>

                  {/* প্রধান অনুসন্ধান ইনপুট */}
                  <div className="relative mb-4 gap-4">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="নাম অথবা বিভাগ দিয়ে খুঁজুন..."
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* অ্যানিমেটেড ফিল্টারসমূহ */}
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-500 
            ${showFilters ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0 overflow-hidden"}`}
                  >
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="">সকল বিভাগ</option>
                      {doctorDepartments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="">সকল জেলা</option>
                      {bangladeshDistricts.map((dist) => (
                        <option key={dist.value} value={dist.value}>
                          {dist.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    >
                      <option value="">লিঙ্গ নির্বাচন</option>
                      <option value="MALE">পুরুষ</option>
                      <option value="FEMALE">মহিলা</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ফলাফল সেকশন (Results Section) */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                        <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {selectedDoctor
                            ? "নির্বাচিত চিকিৎসক"
                            : "উপলব্ধ চিকিৎসকগণ"}
                        </h2>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {selectedDoctor
                            ? "সদস্যপদ সেটআপের জন্য প্রস্তুত"
                            : "চিকিৎসক খুঁজতে ফিল্টার ব্যবহার করুন"}
                        </p>
                      </div>
                    </div>

                    {doctors?.length > 0 && !selectedDoctor && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 w-fit  dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {doctors.length} জন পাওয়া গেছে
                      </Badge>
                    )}
                  </div>

                  {/* লোডিং স্টেট */}
                  {isFetchingDoctors ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                        খোঁজা হচ্ছে...
                      </p>
                    </div>
                  ) : doctors.length > 0 ? (
                    !selectedDoctor ? (
                      <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {doctors.map((doctor: IDoctorResponse) => (
                          <div
                            key={doctor.id}
                            onClick={() => handleSelectDoctor(doctor)}
                            className={`group relative cursor-pointer p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 
    ${
      selectedDoctor?.id === doctor.id
        ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 ring-2 ring-blue-500/20"
        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-500/5"
    }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* ছবি এবং স্ট্যাটাস ইন্ডিকেটর */}
                              <div className="relative flex-shrink-0">
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105">
                                  {doctor.user.image ? (
                                    <Image
                                      src={doctor.user.image}
                                      alt={doctor.user.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
                                      <User className="w-7 h-7 text-blue-500" />
                                    </div>
                                  )}
                                </div>
                                {/* অনলাইন বা ভেরিফাইড ব্যাজ */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-sm">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              </div>

                              {/* তথ্যের মূল অংশ */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                    {!doctor.user.name.startsWith("Dr") &&
                                      "ডাঃ. "}
                                    {doctor.user.name}
                                  </h3>
                                </div>

                                {/* স্পেশালাইজেশন - স্ক্রলযোগ্য ছোট ডিভাইসে */}
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {doctor?.specialization && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                                      {doctor.specialization}
                                    </span>
                                  )}
                                </div>

                                {/* হাসপাতাল এবং লোকেশন */}
                                {doctor.hospital && (
                                  <div className="flex items-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
                                    <Building className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[11px] md:text-sm truncate leading-none">
                                      {doctor.hospital}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* অ্যাকশন ইন্ডিকেটর */}
                              <div className="flex-shrink-0 ml-2">
                                <div
                                  className={`p-1.5 rounded-full transition-all ${
                                    selectedDoctor?.id === doctor.id
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-500"
                                  }`}
                                >
                                  <ChevronRight
                                    className={`w-4 h-4 transition-transform ${selectedDoctor?.id === doctor.id ? "rotate-90" : "group-hover:translate-x-0.5"}`}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* সিলেক্টেড থাকলে একটি ছোট গ্লো ইফেক্ট (ঐচ্ছিক) */}
                            {selectedDoctor?.id === doctor.id && (
                              <div className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* নির্বাচিত ডাক্তার কার্ড */
                      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm p-4 md:p-6 transition-all duration-300">
                        {/* ব্যাকগ্রাউন্ড ডেকোরেশন (ঐচ্ছিক) */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl" />

                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 md:gap-5">
                              {/* প্রোফাইল ইমেজ সেকশন */}
                              <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center border-2 border-blue-100 dark:border-blue-700 shadow-lg p-1">
                                  {selectedDoctor.user.image ? (
                                    <Image
                                      src={selectedDoctor.user.image}
                                      alt="Doctor"
                                      fill
                                      className="rounded-xl object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                      <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                  )}
                                </div>
                                <Badge className="absolute -top-2 -left-2 bg-emerald-500 hover:bg-emerald-600 border-none px-2 py-0.5 text-[10px] md:text-xs shadow-md animate-in fade-in zoom-in duration-500">
                                  নির্বাচিত
                                </Badge>
                              </div>

                              {/* নাম ও ডিপার্টমেন্ট */}
                              <div className="space-y-1">
                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                  {!selectedDoctor.user.name.startsWith("Dr") &&
                                    "ডাঃ. "}
                                  {selectedDoctor.user.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                                  <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
                                    {getDepartmentLabel(
                                      selectedDoctor.department,
                                    ) || "সাধারণ বিভাগ"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* পরিবর্তন বাটন */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDoctor(null)}
                              className="w-full sm:w-auto h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 transition-all group"
                            >
                              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                              <span className="font-medium text-sm">
                                পরিবর্তন করুন
                              </span>
                            </Button>
                          </div>

                          {/* তথ্য গ্রিড */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            {selectedDoctor.specialization && (
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-700 shadow-sm">
                                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                                  <Activity className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                                    বিশেষজ্ঞ
                                  </p>
                                  <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">
                                    {selectedDoctor.specialization}
                                  </p>
                                </div>
                              </div>
                            )}

                            {selectedDoctor.position && (
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-700 shadow-sm">
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                  <Award className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                                    পদবী
                                  </p>
                                  <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">
                                    {selectedDoctor.position}
                                  </p>
                                </div>
                              </div>
                            )}

                            {selectedDoctor.hospital && (
                              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-700 shadow-sm md:col-span-1">
                                <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600">
                                  <Building className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                                    হাসপাতাল
                                  </p>
                                  <p className="text-sm font-semibold truncate text-slate-700 dark:text-slate-200">
                                    {selectedDoctor.hospital}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    /* কোনো ফলাফল না থাকলে */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        কোনো চিকিৎসক পাওয়া যায়নি
                      </h3>
                      <p className="text-gray-500 max-w-xs text-sm">
                        অনুগ্রহ করে ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="mt-4 gap-2"
                      >
                        <X className="w-4 h-4" /> সকল ফিল্টার মুছুন
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right Column - Membership Form */}
            {selectedDoctor && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {/* ফর্ম হেডার */}
                  <div className="bg-gradient-to-r from-green-600 to-emerald-500  py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <UserPlus className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          সদস্যপদের বিবরণ
                        </h2>
                        <p className="text-emerald-100 text-sm">
                          চিকিৎসকের সদস্যপদ কনফিগার করুন
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-6">
                    {/* ফি (Consultation Fee) */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        ৳ ভিজিট বা কনসালটেশন ফি{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="fee"
                        control={form.control}
                        placeholder="৫০০"
                        type="number"
                        min={0}
                        // ইউজার ইংরেজি লিখলে তা বাংলায় রূপান্তর হবে

                        className="pl-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>

                    {/* সর্বোচ্চ অ্যাপয়েন্টমেন্ট (Max Appointments) */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        সর্বোচ্চ অ্যাপয়েন্টমেন্ট সংখ্যা{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="maxAppointments"
                        control={form.control}
                        placeholder="২০"
                        type="number"
                        min={0}
                        className="pl-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>

                    {/* ডিসকাউন্ট (Discount) */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Percent className="w-4 h-4 text-purple-600" />
                        রিপোর্ট ডিসকাউন্ট (%){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="discount"
                        control={form.control}
                        type="number"
                        min={0}
                        placeholder="১০"
                        className="pl-4 py-3 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      />
                    </div>

                    {/* অ্যাকশন বাটনসমূহ */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                      >
                        {isPending ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-2" /> সদস্যপদে যুক্ত
                            করুন
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Empty State when no doctor selected */}
          {!selectedDoctor && (
            <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-10 md:p-16 text-center shadow-inner transition-all duration-500">
              <div className="max-w-sm mx-auto">
                {/* আইকন অ্যানিমেশন */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* টেক্সট সেকশন */}
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
                  চিকিৎসক নির্বাচন করুন
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                  মেম্বারশিপের তথ্য কনফিগার করতে বাম পাশের তালিকা থেকে একজন
                  চিকিৎসক বেছে নিন।
                </p>

                {/* স্ট্যাটাস ইন্ডিকেটর */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
                    অনুসন্ধান করে চিকিৎসক নির্বাচন করুন...
                  </span>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
