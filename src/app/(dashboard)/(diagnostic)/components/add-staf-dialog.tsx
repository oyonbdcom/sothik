/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Edit,
  Loader2,
  Lock,
  Phone,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { useGetAccessibleDoctorsQuery } from "@/redux/api/doctorApi";
import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "@/redux/api/staffApi";
import { z } from "zod";

/* ---------------- ZOD SCHEMA ---------------- */
const staffSchema = z
  .object({
    name: z.string().min(2, "নাম লিখুন"),
    phoneNumber: z.string().min(11, "সঠিক ফোন নম্বর দিন"),
    password: z.string().optional(), // Made optional for update phase
    staffType: z.enum(["RECEPTIONIST", "COORDINATOR"]),
    doctorId: z.string().optional(),
  })
  .refine(
    (data) => {
      // If there's no staff data (Create mode), password is REQUIRED
      if (!data.password || data.password.trim() === "") {
        return false;
      }
      return true;
    },
    {
      message: "কমপক্ষে ৬ ডিজিট",
      path: ["password"],
    },
  );

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffDialogProps {
  staff?: {
    id: string;
    staffType: "RECEPTIONIST" | "COORDINATOR";
    assignedDoctorId?: string | null;
    user: {
      name: string;
      phoneNumber: string;
    };
  };
}

const AddStaffDialog = ({ staff }: StaffDialogProps) => {
  const isEditMode = !!staff;
  const [isOpen, setIsOpen] = useState(false);

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const { data } = useGetAccessibleDoctorsQuery({});

  const isLoading = isCreating || isUpdating;

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(
      // Conditionally bypass refinement if updating so password can be omitted safely
      isEditMode ? staffSchema.innerType() : staffSchema,
    ),
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      staffType: "RECEPTIONIST",
      doctorId: "",
    },
  });

  const staffType = form.watch("staffType");

  useEffect(() => {
    if (staff && isOpen) {
      form.reset({
        name: staff.user.name,
        phoneNumber: staff.user.phoneNumber,
        password: "",
        staffType: staff.staffType,
        doctorId: staff.assignedDoctorId || "",
      });
    }
  }, [staff, isOpen, form]);

  const handleClose = () => {
    if (!isLoading) {
      setIsOpen(false);
      form.reset();
    }
  };

  const onSubmit = async (values: StaffFormValues) => {
    try {
      if (isEditMode && staff) {
        // --- UPDATE OPERATION ---
        await updateStaff({
          id: staff.id,
          data: {
            staffType: values.staffType,
            assignedDoctorId: values.doctorId || null,
            user: {
              name: values.name,
              phoneNumber: values.phoneNumber,
              ...(values.password ? { password: values.password } : {}), // only send password if modified
            },
          },
        }).unwrap();

        toast.success("স্টাফ প্রোফাইল আপডেট করা হয়েছে");
      } else {
        // --- CREATE OPERATION ---
        await createStaff({
          staffType: values.staffType,
          assignedDoctorId: values.doctorId || undefined,
          user: {
            name: values.name,
            phoneNumber: values.phoneNumber,
            password: values.password,
          },
        }).unwrap();

        toast.success("স্টাফ সফলভাবে যোগ হয়েছে");
      }

      handleClose();
    } catch (error: any) {
      toast.error(error?.message || "কিছু সমস্যা হয়েছে");
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      {isEditMode ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all active:scale-95"
          title="সম্পাদনা করুন"
        >
          <Edit size={18} />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100 w-full"
        >
          <UserPlus size={20} />
          <span>নতুন স্টাফ যোগ করুন</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div
                className={`p-6 text-white ${isEditMode ? "bg-amber-500" : "bg-blue-600"}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                      {isEditMode ? <Edit size={24} /> : <UserPlus size={24} />}
                    </div>
                    <div>
                      <h3 className="font-black text-xl leading-tight">
                        {isEditMode
                          ? "স্টাফ প্রোফাইল আপডেট"
                          : "স্টাফ প্রোফাইল তৈরি"}
                      </h3>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                        {isEditMode
                          ? "Update Staff Profile"
                          : "Add New Staff Member"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="p-6 space-y-5"
                  >
                    {/* NAME */}
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="name"
                      label="নাম"
                      icon={User}
                      control={form.control}
                      placeholder="উদা: করিম আলী"
                    />

                    {/* PHONE */}
                    <CustomFormField
                      fieldType={FormFieldType.PHONE_INPUT}
                      name="phoneNumber"
                      label="ফোন নম্বর"
                      icon={Phone}
                      control={form.control}
                      placeholder="017XXXXXXXX"
                    />

                    {/* PASSWORD */}
                    {!staff && (
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name="password"
                        label={
                          isEditMode
                            ? "নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)"
                            : "পাসওয়ার্ড"
                        }
                        icon={Lock}
                        control={form.control}
                        placeholder={
                          isEditMode
                            ? "অপরিবর্তিত রাখতে খালি রাখুন"
                            : "পাসওয়ার্ড লিখুন"
                        }
                        type="password"
                      />
                    )}

                    {/* STAFF TYPE TOGGLE */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase ml-1">
                        স্টাফ টাইপ নির্বাচন করুন
                      </label>
                      <div className="flex rounded-2xl bg-slate-100 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("staffType", "RECEPTIONIST")
                          }
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            staffType === "RECEPTIONIST"
                              ? "bg-white shadow-sm text-blue-600"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          রিসেপশনিস্ট
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            form.setValue("staffType", "COORDINATOR")
                          }
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            staffType === "COORDINATOR"
                              ? "bg-white shadow-sm text-orange-600"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          কো-অর্ডিনেটর
                        </button>
                      </div>
                    </div>

                    {/* DOCTOR SELECT (Conditional) */}
                    <AnimatePresence>
                      {staffType === "COORDINATOR" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-2"
                        >
                          <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            name="doctorId"
                            label="ডাক্তার নির্বাচন করুন"
                            icon={Briefcase}
                            control={form.control}
                            options={data?.doctors?.map((doctor: any) => ({
                              label: doctor?.name || "ডাক্তার",
                              value: doctor?.id,
                            }))}
                          />
                          <p className="text-[10px] text-orange-500 font-medium bg-orange-50 p-2 rounded-lg">
                            * এই কো-অর্ডিনেটর শুধুমাত্র নির্বাচিত ডাক্তারের
                            সিরিয়াল পরিচালনা করবে।
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl active:scale-95 transition-all text-sm"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-[2] text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 disabled:bg-slate-300 transition-all flex justify-center items-center gap-2 text-sm ${
                          isEditMode
                            ? "bg-amber-500 shadow-amber-100 hover:bg-amber-600"
                            : "bg-blue-600 shadow-blue-100 hover:bg-blue-700"
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          "নিশ্চিত করুন"
                        )}
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddStaffDialog;
