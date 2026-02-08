"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  IMembershipResponse,
  UpdateMembershipInput,
} from "@/interface/clinic-membership";
import { useUpdateMembershipMutation } from "@/redux/api/membershipApi";

import { updateClinicMembershipSchema } from "@/zod-validation/membership";

import { zodResolver } from "@hookform/resolvers/zod";

import { Edit } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface ScheduleModalProps {
  member: IMembershipResponse;
}

export function EditDoctorMembership({ member }: ScheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [updateMembership] = useUpdateMembershipMutation();
  const form = useForm<UpdateMembershipInput>({
    resolver: zodResolver(updateClinicMembershipSchema),
    defaultValues: {
      fee: member?.fee ?? 0,
      discount: member?.discount ?? 0,
      maxAppointments: member?.maxAppointments ?? 0,
    },
  });

  // inside your component
  useEffect(() => {
    if (member) {
      form.reset({
        fee: member.fee ?? 0,
        discount: member.discount ?? 0,
        maxAppointments: member.maxAppointments ?? 0,
      });
    }
  }, [member, form]);

  // Inside EditDoctorMembership component

  const onSubmit: SubmitHandler<UpdateMembershipInput> = async (data) => {
    if (isPending) return;

    try {
      await updateMembership({
        id: member.id,
        data: data,
      }).unwrap();

      toast.success("Membership updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit Doctor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Membership</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Membership Details</h3>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="fee"
                label="Visited Fee"
                control={form.control}
                placeholder="0"
                type="number"
                required
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="maxAppointments"
                label="Max Appointments"
                control={form.control}
                placeholder="0"
                type="number"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="discount"
                label="Discount Reports"
                control={form.control}
                placeholder="0"
                type="number"
              />

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                name="isActive"
                label="Available for appointments"
                control={form.control}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Processing..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
