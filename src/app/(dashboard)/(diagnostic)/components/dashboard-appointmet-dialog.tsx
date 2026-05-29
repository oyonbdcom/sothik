"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { phoneRegex } from "@/constant/common";
import { format } from "date-fns";

import { bdStartOfDay } from "@/lib/utils/utils";

import {
  useCreateAppointmentByDiagnosticStaffMutation,
  useUpdateAppointmentMutation,
} from "@/redux/api/appointmentApi";

import { useGetAccessibleDoctorsQuery } from "@/redux/api/doctorApi";

import { zodResolver } from "@hookform/resolvers/zod";

import { AnimatePresence, motion } from "framer-motion";

import {
  Briefcase,
  CalendarCheck,
  Loader2,
  Pencil,
  Plus,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { z } from "zod";

// =====================================================
// SCHEMA
// =====================================================

const appointmentSchema = z.object({
  patientName: z.string().min(1, "পেশেন্টের নাম আবশ্যক"),

  phoneNumber: z
    .string()
    .min(11, "ফোন নম্বর অন্তত ১১ ডিজিটের হতে হবে")
    .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),

  appointmentDate: z.coerce
    .date()
    .refine((date) => date >= bdStartOfDay(new Date()), {
      message: "Past date দেওয়া যাবে না",
    }),

  address: z.string().optional(),

  doctorId: z.string().min(1, {
    message: "ডাক্তার নির্বাচন করা আবশ্যক",
  }),

  ptAge: z.coerce
    .number({
      invalid_type_error: "Age must be a number",
      required_error: "Age is required",
    })
    .min(0)
    .max(120),
});

type TAppointmentForm = z.infer<typeof appointmentSchema>;

// =====================================================
// COMPONENT
// =====================================================

interface Props {
  appointment?: any;
  onClose?: () => void;
}

export default function CreateAppointmentModal({
  appointment,
  onClose,
}: Props) {
  const isEdit = !!appointment;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (appointment) {
      setIsOpen(true);
    }
  }, [appointment]);

  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // API
  // =====================================================

  const [createAppointmentByDiagnosticStaff] =
    useCreateAppointmentByDiagnosticStaffMutation();

  const [updateAppointment] = useUpdateAppointmentMutation();

  const { data } = useGetAccessibleDoctorsQuery({});

  // =====================================================
  // FORM
  // =====================================================

  const form = useForm<TAppointmentForm>({
    resolver: zodResolver(appointmentSchema),

    defaultValues: {
      patientName: "",
      doctorId: "",
      phoneNumber: "",
      appointmentDate: "" as any,
      address: "",
      ptAge: undefined,
    },
  });

  // =====================================================
  // SET EDIT VALUES
  // =====================================================

  useEffect(() => {
    if (appointment && data?.doctors?.length) {
      form.setValue("patientName", appointment.patientName || "");

      form.setValue("phoneNumber", appointment.contactNumber || "");
      form.setValue("ptAge", appointment.age);

      form.setValue(
        "appointmentDate",
        format(new Date(appointment.appointmentDate), "yyyy-MM-dd") as any,
      );

      form.setValue("address", appointment.address || "");

      // IMPORTANT
      form.setValue("doctorId", String(appointment.doctorId));
    }
  }, [appointment, data?.doctors, form]);
  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      form.reset();

      onClose?.();
    }
  };
  // =====================================================
  // SUBMIT
  // =====================================================

  const onSubmit = async (data: TAppointmentForm) => {
    setIsLoading(true);

    try {
      if (isEdit) {
        await updateAppointment({
          id: appointment.id,
          ...data,
        }).unwrap();

        toast.success("অ্যাপয়েন্টমেন্ট আপডেট হয়েছে");
      } else {
        await createAppointmentByDiagnosticStaff(data).unwrap();

        toast.success("অ্যাপয়েন্টমেন্ট তৈরি হয়েছে");
      }

      handleClose();
    } catch (error: any) {
      toast.error(error?.message || error?.message || "কিছু সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ===================================================== */}
      {/* TRIGGER */}
      {/* ===================================================== */}

      {isEdit ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Pencil size={18} />
        </button>
      ) : (
        <Button onClick={() => setIsOpen(true)} size="icon">
          <Plus size={20} />
        </Button>
      )}

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* CARD */}
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* ===================================================== */}
              {/* HEADER */}
              {/* ===================================================== */}

              <div className="p-6 bg-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <CalendarCheck size={24} />
                    </div>

                    <div>
                      <h3 className="font-black text-xl">
                        {isEdit
                          ? "অ্যাপয়েন্টমেন্ট আপডেট"
                          : "নতুন অ্যাপয়েন্টমেন্ট"}
                      </h3>

                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                        {isEdit ? "Update Appointment" : "Create Appointment"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* ===================================================== */}
              {/* FORM */}
              {/* ===================================================== */}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
                >
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="patientName"
                    label="পেশেন্টের নাম"
                    placeholder="নাম লিখুন"
                    required
                    control={form.control}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phoneNumber"
                    label="ফোন নম্বর"
                    required
                    placeholder="017XXXXXXXX"
                    control={form.control}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="appointmentDate"
                      required
                      label="তারিখ"
                      type="date"
                      control={form.control}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="ptAge"
                      label="বয়স (অপশনাল) "
                      placeholder="বয়স  লিখুন"
                      control={form.control}
                    />
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    name="doctorId"
                    label="ডাক্তার নির্বাচন করুন"
                    icon={Briefcase}
                    control={form.control}
                    required
                    options={data?.doctors?.map((doctor: any) => ({
                      label: doctor?.name || "ডাক্তার",

                      value: doctor?.id,
                    }))}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="address"
                    label="ঠিকানা"
                    placeholder="ঠিকানা দিন"
                    control={form.control}
                  />
                  {/* BUTTONS */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl"
                    >
                      বাতিল
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 disabled:bg-slate-300"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : isEdit ? (
                        "আপডেট করুন"
                      ) : (
                        "নিশ্চিত করুন"
                      )}
                    </button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
