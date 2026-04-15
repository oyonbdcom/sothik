/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  Edit,
  LayoutGrid,
  Loader2,
  Lock,
  MapPin,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import {
  useAddClinicMutation,
  useUpdateClinicMutation,
} from "@/redux/api/clinicApi";
import { ClinicFormValues, clinicSchema } from "@/zod-validation/clinic";
import { Separator } from "../ui/separator";

interface ClinicDialogProps {
  clinic?: any;
  isEditMode?: boolean;
}

export default function ClinicDialog({
  clinic,
  isEditMode,
}: ClinicDialogProps) {
  const [open, setOpen] = useState(false);
  const [addClinic, { isLoading: isAdding }] = useAddClinicMutation();
  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();
  const isPending = isAdding || isUpdating;

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      user: {
        name: "",
        phoneNumber: "",
        password: "",
        image: "",
        deactivate: false,
      },
      slug: "",
      address: "",
    },
  });

  useEffect(() => {
    if (isEditMode && clinic) {
      form.reset({
        ...clinic,
        user: {
          name: clinic.user?.name || "",
          phoneNumber: clinic.user?.phoneNumber || "",
          password: "",
          image: clinic.user?.image || "",
          deactivate: clinic.user?.deactivate ?? false,
        },
      });
    }
  }, [clinic, isEditMode, form]);

  const onSubmit = async (values: ClinicFormValues) => {
    try {
      const action = isEditMode
        ? updateClinic({ id: clinic.id, data: values })
        : addClinic(values);
      await action.unwrap();
      toast.success(isEditMode ? "আপডেট হয়েছে" : "যোগ করা হয়েছে");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "ব্যর্থ হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEditMode ? "outline" : "default"}
          className="rounded-xl gap-2"
        >
          {isEditMode ? <Edit size={16} /> : <Plus size={16} />}
          {isEditMode ? "" : "ক্লিনিক যোগ করুন"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-emerald-600 p-6 text-white">
          <DialogTitle className="text-xl">
            {isEditMode ? "এডিট ক্লিনিক" : "নতুন ক্লিনিক"}
          </DialogTitle>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 space-y-4"
          >
            <CustomFormField
              fieldType={FormFieldType.PROFILE}
              name="user.image"
              control={form.control}
            />
            <Separator />
            <div>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="user.name"
                label="নাম"
                icon={Building}
                control={form.control}
                placeholder="আপনার নাম লিখুন"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="slug"
                label="স্লাগ"
                icon={LayoutGrid}
                control={form.control}
                placeholder="clinic-name-slug"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                name="user.phoneNumber"
                label="ফোন"
                control={form.control}
                disabled={isEditMode}
                placeholder="01XXXXXXXXX"
              />
              {!isEditMode && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  label="পাসওয়ার্ড"
                  icon={Lock}
                  control={form.control}
                  placeholder="পাসওয়ার্ড লিখুন"
                />
              )}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="address"
                label="ঠিকানা"
                icon={MapPin}
                control={form.control}
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
              />
            </div>
            {isEditMode && (
              <div className="mt-4 p-1 bg-slate-100 rounded-2xl flex gap-1">
                {/* একটিভ বাটন */}
                <button
                  type="button"
                  onClick={() => form.setValue("user.deactivate", false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    !form.watch("user.deactivate")
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${!form.watch("user.deactivate") ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                  />
                  <span className="text-xs font-bold">সক্রিয়</span>
                </button>

                {/* ইনাক্টিভ বাটন */}
                <button
                  type="button"
                  onClick={() => form.setValue("user.deactivate", true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    form.watch("user.deactivate")
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${form.watch("user.deactivate") ? "bg-rose-500" : "bg-slate-300"}`}
                  />
                  <span className="text-xs font-bold">নিষ্ক্রিয়</span>
                </button>

                <input type="hidden" {...form.register("user.deactivate")} />
              </div>
            )}
            <Button
              disabled={isPending}
              className="w-full h-11 bg-slate-900 rounded-xl"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "সেভ করুন"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
