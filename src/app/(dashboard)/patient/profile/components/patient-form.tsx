/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import ResetButton from "@/components/reset-button";
import SubmitButton from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { bloodGroup, genderOptions } from "@/constant/common";
import { useAuth } from "@/hooks/useAuth";
import { IUpdatePatientRequest } from "@/interface/patient";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
} from "@/redux/api/patientApi";
import {
  Activity,
  CheckCircle2,
  Fingerprint,
  History,
  Info,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PatientForm() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const { data: response, isLoading } = useGetSinglePatientQuery(user?.id, {
    skip: !user?.id,
  });
  const [updatePatient] = useUpdatePatientMutation();

  const form = useForm<IUpdatePatientRequest>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      age: undefined,
      gender: undefined,
      address: "",
      city: "",
      district: "",
      bloodGroup: "",
      image: "",
    },
  });

  useEffect(() => {
    if (response?.patient) {
      const patient = response.patient;
      form.reset({
        name: patient.name || "",
        email: patient.email || "",
        phoneNumber: patient.phoneNumber || "",
        age: patient.age || undefined,
        gender: patient.gender || undefined,
        address: patient.address || "",
        city: patient.city || "",
        district: patient.district || "",
        bloodGroup: patient.bloodGroup || "",
        image: patient.image || "",
      });
    }
  }, [response, form]);

  const onSubmit = async (values: IUpdatePatientRequest) => {
    const patientId = response?.patient?.id;

    if (!patientId) {
      toast.error("গুরুতর ত্রুটি: পেশেন্ট আইডি পাওয়া যায়নি।");
      return;
    }

    startTransition(async () => {
      try {
        const updateData: any = {
          name: values.name,
          age: values.age ? Number(values.age) : undefined,
          gender: values.gender,
          bloodGroup: values.bloodGroup,
          phoneNumber: values.phoneNumber || undefined,
          address: values.address || undefined,
          city: values.city || undefined,
          district: values.district || undefined,
          image: values.image || "",
        };

        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key],
        );

        await updatePatient({
          id: patientId,
          data: updateData,
        }).unwrap();

        toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      } catch (error: any) {
        toast.error(
          error?.data?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
        );
      }
    });
  };

  if (isLoading)
    return (
      <div className="h-96 flex items-center justify-center animate-pulse text-zinc-500 font-medium">
        <Activity className="mr-2 h-5 w-5 animate-spin" /> স্বাস্থ্য প্রোফাইল
        লোড হচ্ছে...
      </div>
    );

  const patient = response?.patient;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* ১. হেডার কার্ড */}
          <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="relative">
              <CustomFormField
                fieldType={FormFieldType.PROFILE}
                name="image"
                control={form.control}
              />
              {!patient?.deactivate && (
                <div
                  className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-950 rounded-full shadow-sm"
                  title="সক্রিয়"
                />
              )}
            </div>

            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {patient?.name}
              </h1>
              <p className="text-zinc-500 font-medium">{patient?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <span className="flex items-center gap-1.5 text-sm bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border">
                  <Fingerprint className="w-4 h-4 text-zinc-400" /> আইডি:{" "}
                  {patient?.id?.slice(-8).toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 text-sm bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border text-red-600 dark:text-red-400 font-bold">
                  রক্তের গ্রুপ: {patient?.bloodGroup || "জানা নেই"}
                </span>
              </div>
            </div>

            <div className="md:ml-auto grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="text-center p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {patient?.totalAppointments || 0}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                  মোট ভিজিট
                </p>
              </div>
              <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border">
                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                  {patient?.age || 0}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                  বর্তমান বয়স
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* ২. ফর্ম ফিল্ডস */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-2">
                  <Info className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider">
                    সাধারণ তথ্য
                  </h3>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="পুরো নাম"
                    icon={User}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    label="ফোন নম্বর"
                    icon={Phone}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="age"
                    label="বয়স"
                    min={0}
                    type="number"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="gender"
                    label="লিঙ্গ"
                    options={genderOptions}
                    placeholder="নির্বাচন করুন"
                  />
                  <div className="md:col-span-2">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="bloodGroup"
                      label="রক্তের গ্রুপ"
                      options={bloodGroup}
                      placeholder="আপনার রক্তের গ্রুপ নির্বাচন করুন"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-950 border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider">
                    ঠিকানা ও আবাসন
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="রাস্তা/গ্রামের ঠিকানা"
                    placeholder="যেমন: হাউজ নং-১০, ব্লক-এ"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="city"
                      label="শহর/থানা"
                    />
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="district"
                      label="জেলা"
                      placeholder="জেলা নির্বাচন করুন"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ৩. সাইডবার অ্যাকশন */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <h4 className="font-semibold text-lg">সংরক্ষণ করতে চান?</h4>
                </div>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  আপনার প্রোফাইল সঠিক ও আপ-টু-ডেট থাকলে আমাদের মেডিকেল টিম
                  আপনাকে আরও উন্নত সেবা প্রদান করতে পারবে।
                </p>
                <SubmitButton
                  isLoading={isPending}
                  className="w-full bg-white text-blue-600 hover:bg-zinc-100 py-6 text-lg font-bold"
                >
                  তথ্য সংরক্ষণ করুন
                </SubmitButton>
                <ResetButton
                  onClick={() => form.reset()}
                  className="w-full mt-3 text-blue-100 hover:text-white border-blue-400 hover:bg-blue-700/50"
                />
              </div>

              <div className="bg-white dark:bg-zinc-950 border rounded-2xl p-6 shadow-sm">
                <h4 className="font-semibold flex items-center gap-2 mb-4 text-sm uppercase tracking-tight text-zinc-700 dark:text-zinc-300">
                  <History className="w-4 h-4 text-zinc-400" /> সিস্টেম লগ
                </h4>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <span className="text-zinc-500 font-medium">
                      প্রোফাইল খোলা হয়েছে
                    </span>
                    <span className="font-semibold">
                      {patient?.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString(
                            "bn-BD",
                          )
                        : "তথ্য নেই"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <span className="text-zinc-500 font-medium">শেষ আপডেট</span>
                    <span className="font-semibold">
                      {patient?.updatedAt
                        ? new Date(patient.updatedAt).toLocaleDateString(
                            "bn-BD",
                          )
                        : "তথ্য নেই"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
