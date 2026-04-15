/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FilterField from "@/components/filter-from";
import LayoutLoader from "@/components/layout-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { bangladeshDistricts } from "@/constant/dristrict";
import { IDepartmentStat, IDoctorResponse } from "@/interface/doctor";

import {
  useDeleteDoctorMutation,
  useGetDoctorsQuery,
  useGetDoctorStatsQuery,
} from "@/redux/api/doctorApi";
import {
  Activity,
  Eye,
  Filter,
  ShieldAlert,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DoctorDialog, {
  default as DoctorDialogEdit,
} from "../../../../../components/doctor/doctor-dialog";

export default function DoctorList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState<string>("all");

  const [district, setDistrict] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const query = {
    page,
    ...(searchTerm && { searchTerm }),
    ...(active !== "all" && { active }),
    ...(district !== "all" && { district }),
    ...(department !== "all" && { department }),
  };

  const { data, isLoading, isError } = useGetDoctorsQuery(query);
  const { data: statsData, isLoading: statsLoading } = useGetDoctorStatsQuery();

  const [deleteDoctor] = useDeleteDoctorMutation();

  const doctors = data?.doctors ?? [];
  const meta = data?.meta;
  const stats = statsData?.stats;

  const handleDelete = async (userId: string) => {
    try {
      const res = await deleteDoctor(userId).unwrap();

      toast.success(res.message || "Doctor updated successfully!");
    } catch (error: any) {
      toast.success(error.message || "something went wrong!");
    }
  };

  // Stats calculations

  if (isLoading || statsLoading) {
    return <LayoutLoader />;
  }
  if (isError) {
    return (
      <div className="flex justify-center py-20 text-red-600">
        Failed to load doctors
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* মোট ডাক্তার */}
        <Card className="relative overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  মোট ডাক্তার
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats?.total?.toLocaleString("bn-BD") || "০"}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <span className="text-blue-600 font-bold mr-1">পুরো সিস্টেম</span>{" "}
              জুড়ে নিবন্ধিত
            </div>
          </CardContent>
        </Card>

        {/* সক্রিয় ডাক্তার */}
        <Card className="relative overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  সক্রিয় আছেন
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats?.active?.toLocaleString("bn-BD") || "০"}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
              বর্তমানে সেবা দিচ্ছেন
            </div>
          </CardContent>
        </Card>

        {/* নিষ্ক্রিয় ডাক্তার */}
        <Card className="relative overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  নিষ্ক্রিয় ডাক্তার
                </p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {stats?.inactive?.toLocaleString("bn-BD") || "০"}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl">
                <ShieldAlert className="h-6 w-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-slate-400">
              <span className="text-rose-500 font-bold mr-1">অপেক্ষমান</span>{" "}
              অথবা ডিঅ্যাক্টিভেটেড
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <FilterField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="ডাক্তারের নাম, বিশেষজ্ঞতা বা হাসপাতাল লিখে খুঁজুন..."
              className="w-full md:max-w-md"
            />

            {/* <FilterField
              value={department}
              onChange={setDepartment}
              placeholder="বিশেষজ্ঞ  নির্বাচন "
              type="select"
              icon={Filter}
              options={doctorDepartments}
              className="w-full"
            /> */}
            <FilterField
              value={district}
              onChange={setDistrict}
              placeholder="জেলা নির্বাচন "
              type="select"
              icon={Filter}
              options={bangladeshDistricts}
              className="w-full"
            />
            <FilterField
              value={active}
              onChange={setActive}
              placeholder="স্ট্যাটাস"
              type="select"
              icon={Filter}
              options={[
                {
                  label: "সক্রিয়",
                  value: "true",
                },
                {
                  label: "নিষ্ক্রিয় ",
                  value: "false",
                },
              ]}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800">
              চিকিৎসক তালিকা
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              মোট {doctors?.length?.toLocaleString("bn-BD")} জন চিকিৎসক পাওয়া
              গিয়েছে
              {searchTerm && ` ("${searchTerm}" এর ফলাফল)`}
            </CardDescription>
          </div>
          <DoctorDialog />
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="py-4 text-slate-600 font-bold">
                    চিকিৎসক
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold">
                    বিভাগ
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold">
                    হাসপাতাল ও অবস্থান
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold text-center">
                    রেটিং
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold">
                    স্ট্যাটাস
                  </TableHead>
                  <TableHead className="text-right text-slate-600 font-bold">
                    অ্যাকশন
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {doctors?.map((doctor: IDoctorResponse) => (
                  <TableRow
                    key={doctor.id}
                    className="hover:bg-blue-50/30 transition-colors border-slate-50"
                  >
                    {/* Profile Cell */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 rounded-xl ring-2 ring-slate-100 ring-offset-2">
                          <AvatarImage
                            src={doctor?.user?.image || ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-bold text-xs">
                            {doctor?.user?.name?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-[15px]">
                            {doctor?.user?.name}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {doctor?.user?.phoneNumber}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Department */}
                    <TableCell>
                      <Badge
                        color="secondary"
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1 rounded-lg text-[12px] font-bold"
                      ></Badge>
                    </TableCell>

                    {/* Hospital */}
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="text-sm font-semibold text-slate-700 leading-snug">
                          {doctor?.hospital}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doctor.position || "বিশেষজ্ঞ চিকিৎসক"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-black text-amber-700">
                          {Number(doctor?.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    {/* <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          doctor?.active
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${doctor?.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                        />
                        {doctor?.active ? "সক্রিয়" : "বন্ধ"}
                      </div>
                    </TableCell> */}

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Button>
                        <DoctorDialogEdit doctor={doctor} isEditMode />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDelete(doctor?.user?.id)}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {doctors?.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                  <Users className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  কোন চিকিৎসক পাওয়া যায়নি
                </h3>
                <p className="text-slate-500 max-w-xs mt-2 text-sm">
                  {searchTerm
                    ? `"${searchTerm}" এর সাথে মিলে যায় এমন কিছু পাওয়া যায়নি।`
                    : "বর্তমানে কোন চিকিৎসক নিবন্ধিত নেই।"}
                </p>
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          {meta && (
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm font-medium text-slate-500">
                সর্বমোট{" "}
                <span className="text-slate-900 font-bold">
                  {meta?.total?.toLocaleString("bn-BD")}
                </span>{" "}
                জনের মধ্যে{" "}
                <span className="text-slate-900 font-bold">
                  {doctors?.length?.toLocaleString("bn-BD")}
                </span>{" "}
                জন দেখানো হচ্ছে
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-bold h-9 border-slate-200"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  পূর্ববর্তী
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-bold h-9 border-slate-200"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta && page >= meta.total}
                >
                  পরবর্তী
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialization Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-slate-800">
            বিশেষজ্ঞতার বিন্যাস
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            বিভাগ অনুযায়ী নিবন্ধিত ডাক্তারদের বর্তমান পরিসংখ্যান
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {stats?.departments?.map((item: IDepartmentStat, index: number) => {
              const barColor = colors[index % colors.length]; // Cycles through colors

              return (
                <div key={item.name} className="space-y-2">
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {/* {getDepartmentLabel(item.name)} */}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {item.count} doctor{item.count !== 1 ? "s" : ""}
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round((item.count / doctors?.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor}  rounded-full`}
                        style={{
                          width: `${(item.count / doctors?.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
];
