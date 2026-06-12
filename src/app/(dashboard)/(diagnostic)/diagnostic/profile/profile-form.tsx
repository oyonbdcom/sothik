/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import ImageUpload from "@/components/imageupload";
import LayoutLoader from "@/components/layout-loader";
import { Form } from "@/components/ui/form";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetDiagnosticByIdentifierQuery,
  useUpdateDiagnosticMutation,
} from "@/redux/api/diagnosticApi";
import { updateDiagnosticSchema } from "@/zod-validation/diagnostic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Loader2, MapPin, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function DiagnosticProfileForm() {
  const { user } = useAuth();
  const mounted = useMounted();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [updateDiagnostic, { isLoading: isUpdating }] =
    useUpdateDiagnosticMutation();

  const { data, isLoading } = useGetDiagnosticByIdentifierQuery(user?.id, {
    skip: !user?.id,
    refetchOnMountOrArgChange: true,
  });

  const diagnostic = data?.diagnostic;

  const form = useForm({
    resolver: zodResolver(updateDiagnosticSchema),
    values: useMemo(
      () => ({
        address: diagnostic?.address ?? "",
        website: diagnostic?.website ?? "",

        user: {
          name: diagnostic?.user?.name ?? "",
          image: diagnostic?.user?.image ?? "",
          phoneNumber: diagnostic?.user?.phoneNumber ?? "",
        },
      }),
      [diagnostic],
    ),
  });

  const onSubmit: SubmitHandler<any> = async (values) => {
    if (!diagnostic?.id) return;
    const finalData = {
      ...values,
      user: {
        ...values.user,
        image: photoPreview || values.user.image,
      },
    };

    try {
      updateDiagnostic({
        id: diagnostic.id,
        data: finalData,
      });

      toast.success("ক্লিনিক প্রোফাইল আপডেট হয়েছে");
      form.reset(values);
    } catch (error: any) {
      toast.error(error?.message || "আপডেট করা সম্ভব হয়নি");
    }
  };

  if (isLoading || !mounted) {
    return <LayoutLoader />;
  }

  return (
    <div className="container      min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ক্লিনিক প্রোফাইল</h1>

        <p className="mt-1 text-sm text-slate-500">
          আপনার ক্লিনিকের তথ্য আপডেট করুন
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mb-5">
        <ImageUpload
          label={diagnostic?.user?.name}
          value={diagnostic?.user?.image || ""}
          setPhotoPreview={(url) => setPhotoPreview(url)}
        />

        {/* <div>
            <h2 className="text-xl font-bold text-slate-900">
              {diagnostic?.user?.name}
            </h2>

            <div className="mt-2 space-y-1 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                {diagnostic?.user?.phoneNumber}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={14} />
                {diagnostic?.address}
              </div>
            </div>
          </div> */}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* PROFILE */}

          {/* BASIC INFO */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              <h3 className="text-base font-semibold text-slate-900">
                বেসিক তথ্য
              </h3>
            </div>

            <div className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="user.name"
                label="ডাইগনস্টিকের নাম"
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                name="user.phoneNumber"
                label="ফোন নাম্বার"
                control={form.control}
              />

              {/* WEBSITE */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="website"
                label="ওয়েবসাইট"
                icon={Globe}
                control={form.control}
                placeholder="https://example.com"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="address"
                label="সম্পূর্ণ ঠিকানা"
                icon={MapPin}
                control={form.control}
              />
            </div>
          </div>

          {/* ACTION */}
          <div className="  ">
            <div className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3 shadow-xl">
              <p className="text-[11px] text-slate-500">
                {form.formState.isDirty
                  ? "পরিবর্তন সংরক্ষণ করা হয়নি"
                  : "সব তথ্য আপডেট আছে"}
              </p>

              <button
                type="submit"
                disabled={!form.formState.isDirty || isUpdating}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold ${
                  form.formState.isDirty
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Save size={16} />
                    আপডেট করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
