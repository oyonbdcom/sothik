/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IPatientResponse } from "@/interface/patient";
import { useUpdatePatientMutation } from "@/redux/api/patientApi";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

interface UpdatePatientModalProps {
  patient: IPatientResponse;
}

const UpdatePatientModal = ({ patient }: UpdatePatientModalProps) => {
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

  const handleStatusUpdate = async (newStatus: boolean) => {
    if (!patient) return;

    try {
      await updatePatient({
        id: patient?.id,
        data: {
          deactivate: newStatus,
        },
      }).unwrap();

      toast.success(
        `Patient ${newStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Management</DialogTitle>
          <DialogDescription>
            Update access for <strong>{patient?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
            <div className="space-y-1">
              <Label className="text-base">Current Status</Label>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    !patient?.deactivate ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium uppercase">
                  {!patient?.deactivate ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                color={!patient?.deactivate ? "destructive" : "primary"}
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(!patient?.deactivate)}
              >
                {isUpdating
                  ? "Updating..."
                  : !patient?.deactivate
                    ? "Deactivate"
                    : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePatientModal;
