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
import { ScrollArea } from "../ui/scroll-area";

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
      toast.error(error?.message || "ব্যর্থ হয়েছে");
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

      <DialogContent className="overflow-hidden rounded-3xl border-0 max-h-[95vh] bg-white p-0 shadow-2xl sm:max-w-xl">
        {/* HEADER */}
        <div className="border-b border-slate-100 bg-white px-6 py-5">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditMode ? "এডিট ক্লিনিক" : "নতুন ক্লিনিক"}
          </DialogTitle>

          <p className="mt-1 text-sm text-slate-500">
            ক্লিনিকের প্রয়োজনীয় তথ্য পূরণ করুন
          </p>
        </div>

        <ScrollArea className="max-h-[75vh]">
          <div className="px-6 py-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* PROFILE */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="  rounded-2xl border border-slate-200 bg-white">
                    <CustomFormField
                      fieldType={FormFieldType.PROFILE}
                      name="user.image"
                      control={form.control}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      ক্লিনিক লোগো
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      একটি পরিষ্কার প্রোফাইল ছবি আপলোড করুন
                    </p>
                  </div>
                </div>

                {/* BASIC INFO */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      বেসিক তথ্য
                    </h3>

                    <p className="text-xs text-slate-500">
                      ক্লিনিকের সাধারণ তথ্য দিন
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="user.name"
                      label="ক্লিনিকের নাম"
                      icon={Building}
                      control={form.control}
                      placeholder="ক্লিনিকের নাম লিখুন"
                    />

                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="slug"
                      label="স্লাগ"
                      icon={LayoutGrid}
                      control={form.control}
                      placeholder="clinic-name"
                    />
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="user.phoneNumber"
                    label="ফোন নাম্বার"
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
                </div>

                {/* STATUS */}
                {isEditMode && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      স্ট্যাটাস
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => form.setValue("user.deactivate", false)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                          !form.watch("user.deactivate")
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        সক্রিয়
                      </button>

                      <button
                        type="button"
                        onClick={() => form.setValue("user.deactivate", true)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                          form.watch("user.deactivate")
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        নিষ্ক্রিয়
                      </button>
                    </div>

                    <input
                      type="hidden"
                      {...form.register("user.deactivate")}
                    />
                  </div>
                )}
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="address"
                  label="ঠিকানা"
                  icon={MapPin}
                  control={form.control}
                />
                {/* FOOTER */}
                <div className="sticky bottom-0 flex items-center justify-end border-t border-slate-100 bg-white pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 rounded-xl bg-slate-900 px-6 text-sm font-semibold hover:bg-slate-800"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "সেভ করুন"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
