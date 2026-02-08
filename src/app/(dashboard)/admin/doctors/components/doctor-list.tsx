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
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
import { IDepartmentStat, IDoctorResponse } from "@/interface/doctor";
import { getDepartmentLabel } from "@/lib/utils/utils";
import {
  useDeleteDoctorMutation,
  useGetDoctorsQuery,
  useGetDoctorStatsQuery,
} from "@/redux/api/doctorApi";
import { Activity, Eye, Filter, Trash2, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import DoctorDialog, { default as DoctorDialogEdit } from "./doctor-dialog";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Doctors
                </p>
                <h3 className="text-2xl font-bold mt-2">{stats?.total}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <h3 className="text-2xl font-bold mt-2"> {stats?.active}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <h3 className="text-2xl font-bold mt-2"> {stats?.inactive}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
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
              placeholder="Search doctors by name, specialty, or hospital..."
              className="w-full md:max-w-md"
            />

            <FilterField
              value={department}
              onChange={setDepartment}
              placeholder="All Department"
              type="select"
              icon={Filter}
              options={doctorDepartments}
              className="w-full"
            />
            <FilterField
              value={district}
              onChange={setDistrict}
              placeholder="All District"
              type="select"
              icon={Filter}
              options={bangladeshDistricts}
              className="w-full"
            />
            <FilterField
              value={active}
              onChange={setActive}
              placeholder="Status"
              type="select"
              icon={Filter}
              options={[
                {
                  label: "Active",
                  value: "true",
                },
                {
                  label: "Inactive",
                  value: "false",
                },
              ]}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="w-fit">
            <CardTitle>Medical Professionals</CardTitle>
            <CardDescription>
              {doctors?.length} doctors found{" "}
              {searchTerm && `matching "${searchTerm}"`}
            </CardDescription>
          </div>
          <DoctorDialog />
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Doctor</TableHead>
                  <TableHead className="w-[180px]">Department</TableHead>
                  <TableHead className="w-full">Hospital & Location</TableHead>
                  <TableHead className="w-full">Positions</TableHead>
                  <TableHead className="w-[100px]">Rating</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[140px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {doctors?.map((doctor: IDoctorResponse) => (
                  <TableRow key={doctor.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-100">
                          <AvatarImage src={doctor?.user?.image || ""} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                            {doctor?.user?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {doctor?.user?.name}
                          </p>
                          <p className="font-semibold text-sm truncate">
                            {doctor?.user?.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                        >
                          {getDepartmentLabel(doctor.department)}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium text-sm w-full">
                          {doctor?.hospital}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {doctor.position ?? "General"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1"></div>
                        <span className="font-semibold text-sm">
                          {doctor?.averageRating?.toFixed(1) || 0}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          doctor?.active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {doctor?.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => console.log("View", doctor.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DoctorDialogEdit doctor={doctor} isEditMode />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(doctor?.user?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {doctors?.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                  <Users className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto mb-6">
                  {searchTerm
                    ? `No doctors match "${searchTerm}". Try a different search term.`
                    : "No doctors are currently registered."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination and Summary */}
          {meta && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {doctors?.length} of {meta?.total} doctors
                {searchTerm && ` matching "${searchTerm}"`}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta && page >= meta.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialization Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Specialization Distribution</CardTitle>
          <CardDescription>Number of doctors by specialty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.departments?.map((item: IDepartmentStat, index: number) => {
              const barColor = colors[index % colors.length]; // Cycles through colors

              return (
                <div key={item.name} className="space-y-2">
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
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
