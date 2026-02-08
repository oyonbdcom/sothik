/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import LayoutLoader from "@/components/layout-loader";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Form } from "@/components/ui/form";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetSingleClinicQuery,
  useUpdateClinicMutation,
} from "@/redux/api/clinicApi";
import { updateClinicSchema } from "@/zod-validation/clinic";
import { AlertCircle, BadgeCheck, Mail, RotateCcw, Save } from "lucide-react";
import { sections } from "../constant";

export default function ClinicProfileForm() {
  const { user } = useAuth();
  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();
  const mounted = useMounted();
  const { data, isLoading } = useGetSingleClinicQuery(user?.id, {
    skip: !user?.id,
  });
  const clinic = data?.clinic;

  // Use 'values' to sync server data directly with form state
  const form = useForm({
    resolver: zodResolver(updateClinicSchema),
    values: useMemo(
      () => ({
        phoneNumber: clinic?.phoneNumber ?? "",
        description: clinic?.description ?? "",
        openingHour: clinic?.openingHour ?? "",
        establishedYear: clinic?.establishedYear ?? new Date().getFullYear(),
        address: clinic?.address ?? "",
        district: clinic?.district ?? "",
        website: clinic?.website ?? "",
        active: true,
        city: clinic?.city ?? "",
        user: {
          name: clinic?.user?.name ?? "",
          image: clinic?.user?.image ?? "",
          phoneNumber: clinic?.user?.phoneNumber ?? "",
        },
      }),
      [clinic, clinic?.user?.image],
    ),
  });

  const onSubmit: SubmitHandler<any> = async (values) => {
    if (!clinic?.userId) return;

    try {
      await updateClinic({
        id: clinic.userId,
        data: values,
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  if (isLoading || !mounted) {
    return <LayoutLoader />;
  }

  return (
    <div className="container">
      {/* পেজ টাইটেল */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          ক্লিনিক সেটিংস
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-1">
          আপনার ক্লিনিকের পরিচিতি এবং পাবলিক প্রোফাইল পরিচালনা করুন।
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* প্রোফাইল হেডার */}
          <ClinicProfileHeader clinic={clinic} control={form.control} />

          {/* তথ্য সেকশন গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section) => (
              <FormSection
                key={section.title}
                section={section}
                control={form.control}
                className={
                  section.fields.some((f) => f.type === "textarea")
                    ? "md:col-span-2"
                    : ""
                }
              />
            ))}
          </div>

          <ActionFooter
            isUpdating={isUpdating}
            isDirty={form.formState.isDirty}
            onReset={() => form.reset()}
          />
        </form>
      </Form>
    </div>
  );
}

export const ClinicProfileHeader = ({ clinic, control }: any) => {
  return (
    <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-2xl shadow-blue-500/5">
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        {/* ছবি সেকশন */}
        <div className="relative shrink-0">
          <div className="relative z-10 w-fit h-fit rounded-3xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 p-2 bg-white dark:bg-slate-800 shadow-xl">
            <CustomFormField
              fieldType={FormFieldType.PROFILE}
              name="user.image"
              control={control}
              containerClassName="w-full h-full rounded-2xl overflow-hidden object-cover"
            />
          </div>
        </div>

        {/* তথ্য সেকশন */}
        <div className="flex-1 space-y-6 text-center md:text-left w-full">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {clinic?.user?.name || "ক্লিনিক লোড হচ্ছে..."}
              </h2>
              {clinic?.user?.isPhoneVerified && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
                  <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                    ভেরিফাইড
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-medium">
                অফিসিয়াল মেডিকেল প্রোফাইল • প্রতিষ্ঠিত:{" "}
                {clinic?.establishedYear || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <ContactBadge
              icon={<Mail className="w-4 h-4" />}
              value={clinic?.user?.phoneNumber}
              theme="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
// Internal Sub-component for better organization
const ContactBadge = ({
  icon,
  value,
  theme,
}: {
  icon: any;
  value: string;
  theme: "blue" | "emerald";
}) => {
  const styles = {
    blue: "bg-blue-50/50 dark:bg-blue-500/5 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    emerald:
      "bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
  };

  return (
    <div
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all hover:scale-105 cursor-default ${styles[theme]}`}
    >
      <span className="shrink-0 opacity-80">{icon}</span>
      <span className="text-sm font-semibold truncate max-w-[200px]">
        {value}
      </span>
    </div>
  );
};

export const FormSection = ({ section, control, className }: any) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-7 shadow-sm flex flex-col ${className}`}
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/50">
        <section.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {section.title}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">{section.description}</p>
      </div>
    </div>

    <div className="space-y-5">
      {section.fields.map((field: any) => (
        <CustomFormField
          key={field.name}
          fieldType={
            field.type === "select"
              ? FormFieldType.SELECT
              : field.type === "textarea"
                ? FormFieldType.TEXTAREA
                : FormFieldType.INPUT
          }
          control={control}
          {...field}
        />
      ))}
    </div>
  </div>
);

const ActionFooter = ({ isUpdating, isDirty, onReset }: any) => {
  return (
    <div className="z-50 px-2">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* স্ট্যাটাস সেকশন */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${isDirty ? "bg-amber-50 dark:bg-amber-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}`}
          >
            {isDirty ? (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-pulse" />
            ) : (
              <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
              {isDirty ? "অসংরক্ষিত পরিবর্তন" : "সবকিছু সিঙ্ক করা আছে"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isDirty
                ? "আপনার আপডেটগুলো সংরক্ষণ করতে ভুলবেন না"
                : "আপনার প্রোফাইল এখন আপ-টু-ডেট"}
            </p>
          </div>
        </div>

        {/* বাটনসমূহ */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            disabled={!isDirty || isUpdating}
            className="flex-1 w-full md:w-fit md:flex-none rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            বাতিল করুন
          </Button>

          <Button
            type="submit"
            disabled={!isDirty || isUpdating}
            className={`flex-1 w-full md:w-fit md:flex-none rounded-2xl px-10 h-12 shadow-lg transition-all duration-300 ${
              isDirty && !isUpdating
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isUpdating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span className="font-bold">তথ্য আপডেট করুন</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
