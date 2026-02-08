/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { bangladeshDistricts } from "@/constant/dristrict";
import { IClinicResponse, IUpdateClinicRequest } from "@/interface/clinic";
import { useUpdateClinicMutation } from "@/redux/api/clinicApi";
import { updateClinicSchema } from "@/zod-validation/clinic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ClinicUpdateDialogProps {
  clinic: IClinicResponse;
  children?: React.ReactNode;
}

export default function ClinicUpdateDialog({
  clinic,
  children,
}: ClinicUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation();

  const form = useForm<IUpdateClinicRequest>({
    resolver: zodResolver(updateClinicSchema),
    defaultValues: {
      user: {
        name: clinic.user?.name || "",
        phoneNumber: clinic.user?.phoneNumber || "",
        image: clinic.user?.image || "",
      },
      phoneNumber: clinic.phoneNumber || "",
      description: clinic.description || "",
      openingHour: clinic.openingHour || "",
      website: clinic.website || "",
      active: clinic.active ?? true,
      establishedYear: clinic.establishedYear || new Date().getFullYear(),
      address: clinic.address || "",
      district: clinic.district || "",
      city: clinic.city || "",
      country: clinic.country || "Bangladesh",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        user: {
          name: clinic.user?.name || "",
          phoneNumber: clinic.user?.phoneNumber || "",
          image: clinic.user?.image || "",
        },
        phoneNumber: clinic.phoneNumber || "",
        description: clinic.description || "",
        openingHour: clinic.openingHour || "",
        website: clinic.website || "",
        active: clinic.active,
        establishedYear: clinic.establishedYear,
        address: clinic.address,
        district: clinic.district,
        city: clinic.city,
        country: clinic.country || "Bangladesh",
      });
    }
  }, [clinic, open, form]);

  async function onSubmit(values: IUpdateClinicRequest) {
    try {
      await updateClinic({
        id: clinic.user?.id as string,
        data: values,
      }).unwrap();

      toast.success("ক্লিনিক প্রোফাইল সফলভাবে আপডেট করা হয়েছে");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={"soft"} size="sm">
            <Icon icon="heroicons:pencil" className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon
                icon="heroicons:pencil-square"
                className="h-5 w-5 text-blue-600"
              />
            </div>
            ক্লিনিক প্রোফাইল সংশোধন
          </DialogTitle>
          <DialogDescription>
            নিচে ক্লিনিকের তথ্য আপডেট করুন। পরিবর্তনগুলো সাথে সাথেই সংরক্ষিত
            হবে।
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomFormField
              fieldType={FormFieldType.PROFILE}
              name="user.image"
              control={form.control}
              containerClassName="w-fit"
            />

            {/* --- বিভাগ ১: অ্যাকাউন্ট তথ্য --- */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                অ্যাকাউন্ট বিবরণ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.name"
                  label="ক্লিনিকের নাম"
                  placeholder="উদা: সিটি হেলথ কেয়ার"
                  control={form.control}
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  name="user.phoneNumber"
                  label=" মোবাইল/নম্বর"
                  placeholder="admin@clinic.com"
                  control={form.control}
                  icon={Lock}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  label="পাসওয়ার্ড"
                  placeholder="••••••••"
                  type="password"
                  control={form.control}
                />

                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  name="phoneNumber"
                  label="ফোন নম্বর (ক্লিনিক)"
                  placeholder="+৮৮০ ১২৩৪..."
                  control={form.control}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="website"
                  label="ওয়েবসাইট লিঙ্ক"
                  placeholder="ওয়েবসাইট ঠিকানা দিন"
                  control={form.control}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* --- বিভাগ ২: ক্লিনিক বিবরণ --- */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                ক্লিনিক প্রোফাইল
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="openingHour"
                  label="খোলার সময়"
                  placeholder="উদা: সকাল ০৮:০০ - রাত ১০:০০"
                  control={form.control}
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="establishedYear"
                  label="প্রতিষ্ঠিত সাল"
                  type="number"
                  control={form.control}
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                name="description"
                label="ক্লিনিকের বিবরণ"
                placeholder="আপনার সেবা সম্পর্কে সংক্ষেপে লিখুন..."
                control={form.control}
              />
            </div>

            <hr className="border-gray-100" />

            {/* --- বিভাগ ৩: অবস্থান --- */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                ঠিকানা/অবস্থান
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="city"
                  label="শহর"
                  placeholder="উদা: ঢাকা"
                  control={form.control}
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  name="district"
                  label="জেলা"
                  options={bangladeshDistricts}
                  placeholder="জেলা নির্বাচন করুন"
                  control={form.control}
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                name="address"
                label="বিস্তারিত ঠিকানা"
                placeholder="রাস্তা, ব্লক, বাসা নম্বর..."
                control={form.control}
              />
            </div>

            {/* --- সেটিংস: সক্রিয় অবস্থা --- */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-gray-700">
                  ক্লিনিকের প্রাপ্যতা (Availability)
                </label>
                <p className="text-xs text-gray-500">
                  ক্লিনিকটি বর্তমানে ইউজাররা খুঁজে পাবে কিনা তা নির্ধারণ করুন।
                </p>
              </div>

              <div className="inline-flex p-1 bg-gray-200 rounded-lg shadow-inner">
                <button
                  type="button"
                  onClick={() => form.setValue("active", true)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    form.watch("active") === true
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  সক্রিয় (ACTIVE)
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("active", false)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    form.watch("active") === false
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  নিষ্ক্রিয় (INACTIVE)
                </button>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUpdating}
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    আপডেট হচ্ছে...
                  </>
                ) : (
                  "ক্লিনিক আপডেট করুন"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
