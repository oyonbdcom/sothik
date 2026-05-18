/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
} from "@/redux/api/patientApi";
import { patientProfileSchema } from "@/zod-validation/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, MapPin, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// ================= SCHEMA =================
const profileSchema = z.object({
  name: z.string().min(2),
  image: z.any().optional(),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(5),
});

type ProfileFormValues = z.infer<typeof patientProfileSchema>;

export default function PatientProfileForm() {
  const { data, isLoading } = useGetSinglePatientQuery(undefined);
  const [updatePatient] = useUpdatePatientMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: "",
      image: "",
      age: 0,
      gender: "MALE",
      address: "",
    },
  });

  const { control, reset, handleSubmit, formState } = form;

  const user = data;
  const patient = user?.patients?.[0];

  // ================= LOAD =================
  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name || "",
      image: user.image || "",
      age: patient?.age || 0,
      gender: patient?.gender || "MALE",
      address: patient?.address || "",
    });
  }, [user, patient, reset]);

  // ================= SUBMIT =================
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return toast.error("User not found");

    try {
      await updatePatient({
        id: user.id,
        data: values,
      }).unwrap();

      toast.success("Updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={35} />
      </div>
    );
  }

  // ================= UI (SIMPLE) =================
  return (
    <div className="w-full   bg-slate-50">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-4"
        >
          {/* IMAGE */}
          <CustomFormField
            fieldType={FormFieldType.PROFILE}
            control={control}
            name="image"
          />

          {/* NAME */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="name"
            label="Name"
            placeholder="Enter name"
            icon={User}
          />

          {/* AGE */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            type="number"
            control={control}
            name="age"
            label="Age"
            icon={Calendar}
          />

          {/* GENDER */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={control}
            name="gender"
            label="Gender"
            options={[
              { label: "Male", value: "MALE" },
              { label: "Female", value: "FEMALE" },
              { label: "Other", value: "OTHER" },
            ]}
          />

          {/* ADDRESS */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="address"
            label="Address"
            placeholder="Enter address"
            icon={MapPin}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-2"
          >
            {formState.isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
