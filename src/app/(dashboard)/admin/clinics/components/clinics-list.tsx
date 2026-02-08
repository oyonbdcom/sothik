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
import { IClinicResponse } from "@/interface/clinic";
import {
  useDeleteClinicMutation,
  useGetClinicsQuery,
  useGetClinicStatsQuery,
} from "@/redux/api/clinicApi";
import {
  Activity,
  Building2,
  Clock,
  Filter,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import ClinicDialog from "./clinic-dialog";

export default function ClinicList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState<string>("all");
  const [district, setDistrict] = useState<string>("all");

  const [page, setPage] = useState<number>(1);

  const query = {
    page,
    ...(searchTerm && { searchTerm }),
    ...(active !== "all" && { active }),
    ...(district !== "all" && { district }),
  };

  const { data, isLoading, isError } = useGetClinicsQuery(query);
  const { data: statsData, isLoading: statsLoading } = useGetClinicStatsQuery();
  const stats = statsData?.stats || {
    total: 0,
    active: 0,
    inactive: 0,
  };

  const [deleteClinic] = useDeleteClinicMutation();

  const clinics: any[] = data?.clinics ?? [];
  const meta = data?.meta;

  const handleDelete = async (userId: string) => {
    try {
      const res = await deleteClinic(userId).unwrap();

      toast.success(res.message || "Doctor updated successfully!");
    } catch (error: any) {
      toast.success(error.message || "something went wrong!");
    }
  };

  if (isLoading || statsLoading) {
    return <LayoutLoader />;
  }
  if (isError) {
    return (
      <div className="flex justify-center py-20 text-red-600">
        Failed to load clinics
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
                  Total clinics
                </p>
                <h3 className="text-2xl font-bold mt-2">{stats.total}</h3>
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
                <h3 className="text-2xl font-bold mt-2">{stats.active}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h3 className="text-2xl font-bold mt-2">{stats.pending}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <h3 className="text-2xl font-bold mt-2">{stats.inactive}</h3>
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
              placeholder="Search clinics by name or city..."
              className="w-full md:max-w-md"
            />

            <div className="flex w-full flex-col md:flex-row items-center gap-3">
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
          </div>
        </CardContent>
      </Card>

      {/* clinics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Professionals</CardTitle>
          <CardDescription>
            {clinics?.length} clinics found{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  {/* Clinic Identity */}
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>Clinic Info</span>
                    </div>
                  </TableHead>

                  {/* Contact Info */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>Contact</span>
                    </div>
                  </TableHead>

                  {/* Location Info */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Location</span>
                    </div>
                  </TableHead>

                  {/* Operational Hours */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Schedule</span>
                    </div>
                  </TableHead>

                  {/* Status */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-500" />
                      <span>Status</span>
                    </div>
                  </TableHead>

                  {/* Actions */}
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Settings2 className="h-4 w-4 text-gray-500" />
                      <span>Actions</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clinics?.map((clinic: IClinicResponse) => (
                  <TableRow key={clinic.id} className="hover:bg-gray-50/50">
                    {/* Clinic Name & Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-100">
                          <AvatarImage src={clinic?.user?.image || ""} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">
                            {clinic?.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {clinic?.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {clinic?.user?.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Specialty / Department */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                      >
                        {clinic?.phoneNumber || "No Phone"}
                      </Badge>
                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium text-sm truncate">
                          {clinic?.address || "No Address"}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {clinic?.city}, {clinic?.district}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Opening Hours */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {clinic?.openingHour || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          clinic?.active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {clinic?.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ensure ClinicDialog is passed the correct data */}
                        <ClinicDialog clinic={clinic} />

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(clinic?.userId)}
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
            {clinics?.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                  <Users className="h-16 w-16" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No clinics found
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto mb-6">
                  {searchTerm
                    ? `No clinics match "${searchTerm}". Try a different search term.`
                    : "No clinics are currently registered."}
                </p>
              </div>
            )}
          </div>

          {/* Pagination and Summary */}
          {meta && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {clinics?.length} of {clinics?.length} clinics
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
    </div>
  );
}
