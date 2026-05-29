/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserRole } from "@/constant/common";
import { useAuth } from "@/hooks/useAuth";
import { IDoctorResponse } from "@/interface/doctor";
import { useGetDoctorsQuery } from "@/redux/api/doctorApi";
import {
  useCreateMembershipMutation,
  useUpdateMembershipMutation,
} from "@/redux/api/membershipApi";
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

export default function MembershipPro({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData?: any;
}) {
  const { user } = useAuth();

  const isDiagnosticUser = user?.role === UserRole.DIAGNOSTIC;

  const [doctorSearch, setDoctorSearch] = useState("");
  const [deptId, setDeptId] = useState("");
  const [gender, setGender] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(
    initialData?.doctor || null,
  );

  const isEditMode = !!initialData;

  // FORM
  const form = useForm<TMembership>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      doctorId: initialData?.doctorId || "",
      fee: initialData?.fee || undefined,
      discount: initialData?.discount || undefined,
      active: initialData?.active ?? true,
    },
  });

  // RESET FORM
  useEffect(() => {
    if (initialData) {
      form.reset({
        doctorId: initialData.doctorId,
        fee: initialData.fee,
        discount: initialData.discount,
        active: initialData.active,
      });

      const timeoutId = setTimeout(() => {
        setSelectedDoctor(initialData.doctor);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [initialData, form]);

  // SYNC DOCTOR
  useEffect(() => {
    if (selectedDoctor) {
      form.setValue("doctorId", selectedDoctor.id);
    }
  }, [selectedDoctor, form]);

  // API
  const { data: deptData } = useGetDepartmentsQuery(undefined);

  const { data: doctorData, isFetching: docFetching } = useGetDoctorsQuery({
    searchTerm: doctorSearch,
    departmentId: deptId || undefined,
    gender: gender || undefined,
    myAreaOnly: "true",
    limit: 20,
  });

  const [createMembership, { isLoading: isCreating }] =
    useCreateMembershipMutation();

  const [updateMembership, { isLoading: isUpdating }] =
    useUpdateMembershipMutation();

  const isSaving = isCreating || isUpdating;

  // SELECT DOCTOR
  const handleDoctorSelect = (doc: IDoctorResponse) => {
    setSelectedDoctor(doc);
  };

  // SUBMIT
  const onSubmit = async (values: TMembership) => {
    if (!selectedDoctor) {
      return toast.error("আগে একজন ডাক্তার নির্বাচন করুন");
    }

    try {
      if (isEditMode) {
        await updateMembership({
          id: initialData.id,
          data: values,
        }).unwrap();

        toast.success("মেম্বারশিপ সফলভাবে আপডেট হয়েছে");
      } else {
        await createMembership({
          doctorId: values.doctorId,
          fee: Number(values.fee),
          discount: Number(values.discount),
          active: values.active,
        }).unwrap();

        toast.success(`${selectedDoctor.user?.name} এর মেম্বারশিপ তৈরি হয়েছে`);
      }

      onClose();
    } catch (err: any) {
      toast.error(
        err?.message || err?.message || "মেম্বারশিপ সেভ করতে সমস্যা হয়েছে",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* TOP */}
      <div className="border-b border-slate-100 bg-white px-4 py-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800">
              {isEditMode ? "মেম্বারশিপ আপডেট" : "ডাক্তার নির্বাচন"}
            </h2>

            <p className="text-[11px] text-slate-400">
              ক্লিনিকের জন্য ডাক্তার যুক্ত করুন
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl px-3 py-2 text-[10px] font-bold transition ${
              showFilters
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <Filter size={12} className="inline mr-1" />
            Filter
          </button>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="relative col-span-2">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="ডাক্তারের নাম লিখুন..."
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none"
              />
            </div>

            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none"
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
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium outline-none"
            >
              <option value="">লিঙ্গ</option>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
            </select>
          </div>
        )}

        {/* DOCTORS */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max gap-4 pb-2">
            {docFetching
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-12 animate-pulse rounded-full bg-slate-200"
                  />
                ))
              : doctorData?.doctors?.map((doc: IDoctorResponse) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className="flex cursor-pointer flex-col items-center gap-1"
                  >
                    <div
                      className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all ${
                        selectedDoctor?.id === doc.id
                          ? "border-emerald-500"
                          : "border-slate-200"
                      }`}
                    >
                      {doc.user?.image ? (
                        <Image
                          src={doc.user.image}
                          alt={doc.user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-sm font-bold text-emerald-600">
                          {doc.user?.name?.[0]}
                        </div>
                      )}

                      {selectedDoctor?.id === doc.id && (
                        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                          <Check
                            size={9}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>

                    <p className="max-w-[60px] truncate text-center text-[9px] font-bold text-slate-500">
                      {doc.user?.name}
                    </p>
                  </div>
                ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* DIAGNOSTIC INFO */}
      {isDiagnosticUser && (
        <div className="border-b border-slate-100 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-blue-600">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white">
                  <Building2 size={24} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-black text-slate-800">
                {user?.name}
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                {user?.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          {/* SUMMARY */}
          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Summary
            </h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                <Stethoscope size={16} className="text-emerald-500" />

                <span className="truncate text-xs font-bold text-slate-700">
                  {selectedDoctor?.user?.name || "Doctor not selected"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
                <Building2 size={16} className="text-blue-500" />

                <span className="truncate text-xs font-bold text-slate-700">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>

          {/* SETTINGS */}
          <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="fee"
                label="ফি"
                placeholder="500"
                icon={Banknote}
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="discount"
                label="ডিসকাউন্ট"
                placeholder="10"
                icon={Percent}
                control={form.control}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSaving || !selectedDoctor}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-all ${
              isSaving || !selectedDoctor
                ? "bg-slate-200 text-slate-400"
                : "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
            }`}
          >
            {isSaving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isEditMode ? "Update Membership" : "Save Membership"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
