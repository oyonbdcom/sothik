/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IClinicResponse } from "@/interface/clinic";
import { IDoctorResponse } from "@/interface/doctor";
import { useGetClinicsQuery } from "@/redux/api/clinicApi";
import { useGetDoctorsQuery } from "@/redux/api/doctorApi";
import {
  useCreateMembershipMutation,
  useUpdateMembershipMutation,
} from "@/redux/api/membershipApi"; // Update mutation যোগ করা হয়েছে
import { useGetDepartmentsQuery } from "@/redux/api/setup";
import { membershipSchema, TMembership } from "@/zod-validation/membership";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  Filter,
  Loader2,
  Percent,
  Search,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

// initialData প্রপস যোগ করা হয়েছে
export default function MembershipPro({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: any;
}) {
  const [doctorSearch, setDoctorSearch] = useState("");
  const [deptId, setDeptId] = useState("");
  const [gender, setGender] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // এডিট মোডে থাকলে initialData থেকে স্টেট সেট করা হচ্ছে
  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    initialData?.doctor || null,
  );
  const [selectedClinicId, setSelectedClinicId] = useState<string>(
    initialData?.clinicId || "",
  );

  const isEditMode = !!initialData;

  // Form Setup
  const form = useForm<TMembership>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      doctorId: initialData?.doctorId || "",
      clinicId: initialData?.clinicId || "",
      fee: initialData?.fee || undefined,
      discount: initialData?.discount || undefined,
      active: initialData?.active ?? true,
    },
  });

  // ডাটা আপডেট হলে ফর্ম রিসেট করার জন্য (এডিট মোডের জন্য জরুরি)
  useEffect(() => {
    if (initialData) {
      // form.reset ব্যবহার করুন ডাটা লোড করার জন্য
      form.reset({
        doctorId: initialData.doctorId,
        clinicId: initialData.clinicId,
        fee: initialData.fee,
        discount: initialData.discount,
        active: initialData.active,
      });

      const timeoutId = setTimeout(() => {
        setSelectedDoctor(initialData.doctor);
        setSelectedClinicId(initialData.clinicId);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [initialData, form]);

  // Sync selection with React Hook Form
  useEffect(() => {
    if (selectedDoctor) form.setValue("doctorId", selectedDoctor.id);
    if (selectedClinicId) form.setValue("clinicId", selectedClinicId);
  }, [selectedDoctor, selectedClinicId, form]);

  // API Calls
  const { data: deptData } = useGetDepartmentsQuery(undefined);
  const { data: doctorData, isFetching: docFetching } = useGetDoctorsQuery({
    searchTerm: doctorSearch,
    departmentId: deptId || undefined,
    gender: gender || undefined,
    myAreaOnly: "true",
    limit: 20,
  });
  const { data: clinicData } = useGetClinicsQuery({ myAreaOnly: "true" });

  const [createMembership, { isLoading: isCreating }] =
    useCreateMembershipMutation();
  const [updateMembership, { isLoading: isUpdating }] =
    useUpdateMembershipMutation();

  const isSaving = isCreating || isUpdating;

  const handleDoctorSelect = (doc: any) => {
    setSelectedDoctor(doc);
    if (!isEditMode) setSelectedClinicId("");
  };

  const onSubmit = async (values: TMembership) => {
    if (!selectedDoctor) return toast.error("আগে একজন ডাক্তার সিলেক্ট করুন");
    if (!selectedClinicId) return toast.error("একটি ক্লিনিক সিলেক্ট করুন");

    try {
      if (isEditMode) {
        // আপডেট লজিক
        await updateMembership({ id: initialData.id, data: values }).unwrap();
        toast.success("মেম্বারশিপ সফলভাবে আপডেট হয়েছে");
      } else {
        // ক্রিয়েট লজিক
        await createMembership(values).unwrap();
        toast.success(`${selectedDoctor.user.name}-এর মেম্বারশিপ তৈরি হয়েছে`);
      }
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "সেভ করতে সমস্যা হয়েছে",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* বিশেষজ্ঞ নির্বাচন সেকশন */}
      <div className="bg-white border-b border-slate-100 px-4 pt-3 pb-2 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
            <h2 className="text-slate-800 font-bold text-[12px]">
              {isEditMode
                ? "বিশেষজ্ঞ (পরিবর্তন করতে চাইলে সিলেক্ট করুন)"
                : "বিশেষজ্ঞ নির্বাচন"}
            </h2>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${showFilters ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}
          >
            <Filter size={10} className="inline mr-1" /> ফিল্টার
          </button>
        </div>

        {/* ফিল্টার ইনপুটগুলো আগের মতোই থাকবে... */}
        {showFilters && (
          <div className="grid grid-cols-2 gap-2 mb-3 animate-in fade-in slide-in-from-top-2">
            <div className="relative col-span-2">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={12}
              />
              <input
                type="text"
                placeholder="ডাক্তারের নাম খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] outline-none"
                onChange={(e) => setDoctorSearch(e.target.value)}
              />
            </div>
            {/* Dept & Gender Selectors... */}
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-2 outline-none"
            >
              <option value="">ডিপার্টমেন্ট</option>
              {deptData?.departments?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="text-[10px] font-bold bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-2 outline-none"
            >
              <option value="">লিঙ্গ</option>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
            </select>
          </div>
        )}

        <ScrollArea className="w-full whitespace-nowrap bg-white p-2">
          <div className="flex w-max space-x-4 p-1">
            {docFetching
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-11 h-11 rounded-full bg-slate-100 animate-pulse shrink-0"
                  />
                ))
              : doctorData?.doctors?.map((doc: IDoctorResponse) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div
                      className={`relative w-11 h-11 rounded-full p-[1.5px] transition-all ${selectedDoctor?.id === doc.id ? "bg-emerald-500 ring-1 ring-emerald-500 ring-offset-1" : "bg-slate-200 group-hover:bg-emerald-300"}`}
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                        {doc.user?.image ? (
                          <Image
                            src={doc.user.image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                            {doc.user?.name[0]}
                          </div>
                        )}
                      </div>
                      {selectedDoctor?.id === doc.id && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border border-white rounded-full flex items-center justify-center z-10 shadow-sm">
                          <Check
                            size={7}
                            className="text-white"
                            strokeWidth={5}
                          />
                        </div>
                      )}
                    </div>
                    <div className="leading-3">
                      <p className="text-[9px] font-bold max-w-[60px] text-center text-slate-500 truncate">
                        {doc?.user?.name}
                      </p>
                      <p className="text-[8px] font-medium max-w-[60px] text-center text-slate-400 truncate">
                        {doc?.department?.name}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
          <ScrollBar
            orientation="horizontal"
            className="h-1.5 bg-transparent"
          />
        </ScrollArea>
      </div>

      {/* ক্লিনিক নির্বাচন সেকশন */}
      <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-3 bg-blue-500 rounded-full" />
          <h2 className="text-slate-800 font-bold text-[12px]">
            ক্লিনিক নির্বাচন
          </h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-3 py-1">
            {clinicData?.clinics?.map((clinic: IClinicResponse) => {
              const isSelected = selectedClinicId === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinicId(clinic.id)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105" : "bg-white border border-slate-200 text-slate-400"}`}
                  >
                    <Building2 size={18} />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                        <Check
                          size={7}
                          className="text-white"
                          strokeWidth={5}
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-[9px] font-bold truncate w-20 text-center ${isSelected ? "text-blue-700" : "text-slate-500"}`}
                  >
                    {clinic.name}
                  </p>
                </div>
              );
            })}
          </div>
          <ScrollBar
            orientation="horizontal"
            className="h-1.5 bg-transparent"
          />
        </ScrollArea>
      </div>

      {/* ফর্ম সেকশন */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* সামারি কার্ড */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              সিলেকশন সামারি
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl">
                <Stethoscope size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-700 truncate">
                  {selectedDoctor?.user?.name || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl">
                <Building2 size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-700 truncate">
                  {clinicData?.clinics?.find(
                    (c: any) => c.id === selectedClinicId,
                  )?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* সেটিংস কার্ড */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-800 font-bold text-sm">সেটিংস ও ফি</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Active
                </span>
                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  name="active"
                  control={form.control}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="fee"
                label="ভিজিট ফি"
                placeholder="৳ ৫০০"
                icon={Banknote}
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="discount"
                label="ডিসকাউন্ট (%)"
                placeholder="১০%"
                icon={Percent}
                control={form.control}
              />
            </div>
          </div>

          {/* সেভ বাটন */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || !selectedDoctor || !selectedClinicId}
              className={`flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full shadow-lg transition-all active:scale-95 ${
                isSaving || !selectedDoctor || !selectedClinicId
                  ? "bg-slate-200 text-slate-400"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="font-black uppercase text-[11px] tracking-widest">
                    {isEditMode ? "Update Membership" : "Save Membership"}
                  </span>
                  <ArrowRight size={16} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
