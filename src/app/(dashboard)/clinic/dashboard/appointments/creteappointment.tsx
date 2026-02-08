/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Calendar,
  Clock,
  Hash,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Stethoscope,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateAppointmentForAdminMutation } from "@/redux/api/appointmentApi";
import { useGetMyDoctorsQuery } from "@/redux/api/membershipApi";

/* -------------------- Validation Schema -------------------- */
const AdminAppointmentSchema = z.object({
  doctorId: z.string().min(1, "চিকিৎসক নির্বাচন করুন"),
  patientName: z.string().min(1, "রোগীর নাম আবশ্যক"),
  ptAge: z.string().min(1, "বয়স আবশ্যক"),
  phoneNumber: z.string().min(11, "সঠিক ফোন নম্বর দিন"),
  address: z.string().min(1, "ঠিকানা আবশ্যক"),
  appointmentDate: z.string().min(1, "তারিখ আবশ্যক"),
  times: z.string().min(1, "সময় আবশ্যক"),
  serialNumber: z.coerce.number().min(1, "সিরিয়াল আবশ্যক"),
  refby: z.string().optional(),
});

type AdminFormValues = z.infer<typeof AdminAppointmentSchema>;

/* -------------------- Component -------------------- */
export default function ClinicAdminAppointmentDialog({
  clinicId,
}: {
  clinicId: string;
}) {
  const [open, setOpen] = useState(false);

  const { data: doctorsData, isLoading: doctorLoading } =
    useGetMyDoctorsQuery(undefined);

  const [createAppointmentForAdmin, { isLoading: createLoading }] =
    useCreateAppointmentForAdminMutation();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(AdminAppointmentSchema),
    defaultValues: {
      doctorId: "",
      patientName: "",
      ptAge: "",
      phoneNumber: "",
      address: "",
      appointmentDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      times: "",
      serialNumber: undefined,
      refby: "",
    },
  });

  const selectedDoctorId = form.watch("doctorId");

  /* -------------------- Final Submit -------------------- */
  const onFinalSubmit = async (data: AdminFormValues) => {
    try {
      const payload = {
        ...data,
        clinicId,
        serialNumber: Number(data.serialNumber),
        appointmentDate: new Date(data.appointmentDate).toISOString(),
      };

      await createAppointmentForAdmin(payload).unwrap();

      toast.success("অ্যাপয়েন্টমেন্ট সফলভাবে সংরক্ষণ হয়েছে");
      setOpen(false);
      form.reset();
    } catch (err: any) {
      toast.error(err?.data?.message || "বুকিং সম্পন্ন করা যায়নি");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 w-full hover:bg-emerald-700 text-white rounded-xl gap-2 shadow-md">
          <Plus size={18} />
          নতুন অ্যাপয়েন্টমেন্ট
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-0 rounded-[2rem] overflow-hidden shadow-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinalSubmit)}
            className="flex flex-col max-h-[90vh]"
          >
            <DialogHeader className="bg-slate-50 p-6 border-b">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Calendar className="text-emerald-600" />
                অ্যাডমিন বুকিং প্যানেল
              </DialogTitle>
            </DialogHeader>

            <div className="p-8 space-y-6 overflow-y-auto">
              {/* -------- Doctor Select -------- */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>চিকিৎসক নির্বাচন করুন *</FormLabel>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        {...field}
                        className="w-full border rounded-xl py-3 pl-10 pr-4 bg-slate-50"
                        disabled={doctorLoading}
                      >
                        <option value="">ডক্টর বেছে নিন...</option>
                        {doctorsData?.map((doc: any) => (
                          <option key={doc.id} value={doc.userId}>
                            {doc.name} ({doc.department || "General"})
                          </option>
                        ))}
                      </select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* -------- Show after doctor select -------- */}
              {selectedDoctorId && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="patientName"
                      label="রোগীর নাম *"
                      control={form.control}
                      icon={User}
                      placeholder="রোগীর পূর্ণ নাম লিখুন"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="ptAge"
                      label="বয়স *"
                      control={form.control}
                      placeholder="বয়স (বছর)"
                    />
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phoneNumber"
                    label="ফোন নম্বর *"
                    control={form.control}
                    icon={Phone}
                    placeholder="যেমন: 01XXXXXXXXX"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="address"
                    label="ঠিকানা *"
                    control={form.control}
                    placeholder="ঠিকানা লিখুন"
                    icon={MapPin}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="appointmentDate"
                      label="তারিখ *"
                      type="date"
                      control={form.control}
                      placeholder="তারিখ নির্বাচন করুন"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="times"
                      label="সময় *"
                      type="time"
                      control={form.control}
                      icon={Clock}
                      placeholder="সময় নির্বাচন করুন"
                    />
                  </div>

                  <div className="flex  justify-between gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="serialNumber"
                      label="সিরিয়াল নম্বর *"
                      type="number"
                      control={form.control}
                      icon={Hash}
                      placeholder="যেমন: 1, 2, 3..."
                    />

                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="refby"
                      label="রেফারেন্স (Ref By)"
                      placeholder="ডাক্তার / প্রতিনিধি"
                      control={form.control}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createLoading}
                    className="w-full h-12 bg-emerald-600 rounded-2xl font-bold text-white mt-4"
                  >
                    {createLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        অ্যাপয়েন্টমেন্ট সংরক্ষণ করুন <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
