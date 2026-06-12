/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import ImageUpload from "@/components/imageupload";
import { Form } from "@/components/ui/form";
import {
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
} from "@/redux/api/patientApi";
import { patientProfileSchema } from "@/zod-validation/patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// ================= SCHEMA =================

type ProfileFormValues = z.infer<typeof patientProfileSchema>;

export default function PatientProfileForm() {
  const { data, isLoading } = useGetPatientByIdQuery(undefined);
  const [updatePatient] = useUpdatePatientMutation();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
  const patient = user?.patient;

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
    <div className=" bg-white p-4   ">
      <div className="w-full container shadow-sm p-4 rounded-md ">
        <ImageUpload
          label={user?.name || "Patient Profile"} // ইউজারের নাম দেখাবে
          value={photoPreview || user?.image || ""} // প্রিভিউ থাকলে সেটি, নাহলে প্রোফাইল পিক
          setPhotoPreview={(url) => setPhotoPreview(url)}
        />
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4  p-4">
            {/* IMAGE */}

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
              className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center gap-2"
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
    </div>
  );
}
