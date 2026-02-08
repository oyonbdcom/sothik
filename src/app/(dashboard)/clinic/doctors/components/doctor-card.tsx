/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { enToBnNumber, getDepartmentLabel } from "@/lib/utils/utils";
import { useDeleteMembershipMutation } from "@/redux/api/membershipApi";
import {
  Award,
  Building,
  CalendarCheck,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { EditDoctorMembership } from "./membership-edit-modal";
import { ScheduleCard } from "./schedule-card";
import { ScheduleModal } from "./schedule-modal";

interface DoctorCardProps {
  member: IMembershipResponse;
}
// বাংলা থেকে ইংরেজিতে রূপান্তর
const bnToEn = (str: string) =>
  str.replace(/[০-৯]/g, (d) => "0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);

// ইংরেজি থেকে বাংলায় রূপান্তর
const enToBn = (num: number | string) =>
  num.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);

// পুরাতন রোগীর ফি বের করার ফাংশন
const calculateReturnFeeBn = (feeBn: string | undefined) => {
  if (!feeBn) return "০";
  const enFee = Number(bnToEn(feeBn));
  const discountedFee = Math.max(enFee - 100, 0);
  return enToBn(discountedFee);
};
export const DoctorCard = ({ member }: DoctorCardProps) => {
  const [deleteMembership] = useDeleteMembershipMutation();

  const handleDeleteMembership = async (id: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই চিকিৎসককে অপসারণ করতে চান?"))
      return;
    try {
      await deleteMembership(id).unwrap();
      toast.success("চিকিৎসককে সফলভাবে অপসারণ করা হয়েছে");
    } catch (err) {
      toast.error("অপসারণ করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 hover:border-blue-400/50 overflow-hidden border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 rounded-3xl">
      <CardContent className="p-0">
        {/* প্রোফাইল হেডার */}
        <div className="p-5 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-md">
                <AvatarImage
                  src={member?.doctor?.user?.image || ""}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-600 text-white font-bold text-xl">
                  {member?.doctor?.user?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                {member?.doctor?.user?.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {member?.doctor?.department && (
                  <Badge
                    color="secondary"
                    className="bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none px-2 py-0"
                  >
                    {getDepartmentLabel(member?.doctor?.department)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* ডিটেইলস সেকশন */}
        <div className="p-5 space-y-5">
          {/* কর্মস্থল ও পদবী */}
          <div className="space-y-2">
            {member?.doctor?.hospital && (
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <Building className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {member?.doctor?.hospital}
                </span>
              </div>
            )}
            {member?.doctor?.position && (
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Award className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {member?.doctor?.position}
                </span>
              </div>
            )}
          </div>

          {/* ফি এবং ডিসকাউন্ট কার্ড */}
          <div className="relative overflow-hidden p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  নতুন রোগী
                </p>
                <p className="font-black text-xl text-gray-900 dark:text-white">
                  {enToBnNumber(member.fee)} ৳
                </p>
              </div>
              <div className="space-y-1 border-l pl-4">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  পুরাতন রোগী
                </p>
                <p className="font-black text-xl text-blue-600 dark:text-blue-400">
                  {enToBnNumber(member.fee - 100)} ৳
                </p>
              </div>
            </div>
            {member?.discount && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  টেস্ট ডিসকাউন্ট
                </span>
                <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-none font-bold">
                  {enToBnNumber(member?.discount)}% ছাড়
                </Badge>
              </div>
            )}
          </div>

          {/* অ্যাপয়েন্টমেন্ট প্রগ্রেস */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <CalendarCheck className="w-4 h-4 text-blue-500" />
                দৈনিক অ্যাপয়েন্টমেন্ট
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                সর্বোচ্চ {enToBnNumber(member.maxAppointments || 0)} টি
              </span>
            </div>
          </div>

          {/* শিডিউল সেকশন */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Clock className="h-4 w-4 text-orange-500" />
                সময়সূচী ({member?.schedules?.length || 0})
              </p>
              <ScheduleModal membershipId={member.id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  নতুন সময়
                </Button>
              </ScheduleModal>
            </div>

            {member.schedules && member.schedules.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
                {member.schedules.map((schedule: any) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">
                  কোনো সময়সূচী সেট করা নেই
                </p>
              </div>
            )}
          </div>
        </div>

        {/* অ্যাকশন বাটনসমূহ */}
        <div className="p-4 bg-gray-50/80 dark:bg-gray-800/80 border-t flex flex-col sm:flex-row gap-3">
          <EditDoctorMembership member={member} />

          <Button
            variant="outline"
            onClick={() => handleDeleteMembership(member?.id)}
            className="w-full border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-xl"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            ডিলিট করুন
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
