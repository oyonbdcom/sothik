"use client";

import LayoutLoader from "@/components/layout-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import FilterField from "@/components/filter-from";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bangladeshDistricts } from "@/constant/dristrict";
import { useMounted } from "@/hooks/use-mounted";
import { IPatientResponse } from "@/interface/patient";
import { formatDate } from "@/lib/utils/utils";
import {
  useGetPatientsQuery,
  useGetPatientStatsQuery,
} from "@/redux/api/patientApi";
import {
  Activity,
  Building,
  Calendar,
  Filter,
  Heart,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import UpdatePatientModal from "./update-dialog";

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState<string>("all");

  const [district, setDistrict] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const query = {
    page,
    ...(searchTerm && { searchTerm }),
    ...(active !== "all" && { active }),
    ...(district !== "all" && { district }),
    ...(gender !== "all" && { gender }),
  };
  const isClient = useMounted();
  const { data, isLoading, isError } = useGetPatientsQuery(query);
  const { data: statsData, isLoading: statsLoading } =
    useGetPatientStatsQuery();
  const stats = statsData?.stats || {
    total: 0,
    active: 0,
    inactive: 0,
  };
  const patients: IPatientResponse[] = data?.patients || [];
  const meta = data?.meta;

  if (isLoading || statsLoading) {
    return <LayoutLoader />;
  }
  if (isError) {
    return <h1>Faild to load data</h1>;
  }

  // Don't render date-dependent content during SSR
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
                <h3 className="text-2xl font-bold mt-2"> {stats?.total}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Patients
                </p>
                <h3 className="text-2xl font-bold mt-2"> {stats?.active}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

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
              placeholder="Search doctors by name, specialty, or hospital..."
              className="w-full md:max-w-md"
            />

            <FilterField
              value={gender}
              onChange={setGender}
              placeholder="Gender"
              type="select"
              icon={Filter}
              options={[
                {
                  label: "MALE",
                  value: "MALE",
                },
                {
                  label: "Female",
                  value: "FEMALE",
                },
              ]}
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
                  value: "false",
                },
                {
                  label: "Deactivate",
                  value: "true",
                },
              ]}
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
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>
            {patients?.length} patients found{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <div className="grid grid-cols-1 gap-4">
            {patients?.length > 0 ? (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className="group relative flex flex-col lg:flex-row gap-6 p-2 md:p-5 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all duration-200"
                >
                  {/* 1. Primary Info & Avatar - Using Flattened Data */}
                  <div className="flex flex-col md:flex-row flex-1 gap-4 min-w-0">
                    <Avatar className="h-16 w-16 rounded-lg ring-2 ring-gray-50">
                      <AvatarImage src={patient.image || ""} />
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-lg font-bold">
                        {patient.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 overflow-hidden">
                      <h3 className="font-bold text-gray-900 truncate flex items-center gap-2">
                        {patient.name}
                        {/* Note: Inverted logic - if isDeactivated is false, show green (Active) */}
                        {!patient.deactivate ? (
                          <span
                            className="h-2 w-2 rounded-full bg-green-500"
                            title="Active"
                          />
                        ) : (
                          <span
                            className="h-2 w-2 rounded-full bg-red-400"
                            title="Deactivated"
                          />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {patient.email}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          <User className="h-3 w-3" /> {patient.gender}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          <Heart className="h-3 w-3" />{" "}
                          {patient.bloodGroup || "N/A"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          <Activity className="h-3 w-3" /> Age:{" "}
                          {patient.age || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Last Appointment Block - Using Flattened Object */}
                  <div className="flex-1 border-l border-r border-gray-50 px-0 lg:px-6">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
                      Last Appointment
                    </p>
                    {patient.latestAppointment ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              {formatDate(patient.latestAppointment.date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              with{" "}
                              <span className="text-blue-600">
                                Dr. {patient.latestAppointment.doctorName}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-xs text-gray-500 italic">
                            {patient.latestAppointment.clinicName}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No appointment history
                      </p>
                    )}
                  </div>

                  {/* 3. Stats & Contact */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                    <div className="flex gap-4 text-right">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Total Visits</p>
                        <p className="font-bold text-gray-900">
                          {patient.totalAppointments}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Records</p>
                        <p className="font-bold text-gray-900">
                          {/* Accessing medicalRecordsCount from our latestAppointment map */}
                          {patient.latestAppointment?.medicalRecordsCount || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <UpdatePatientModal patient={patient} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                No patients found
              </div>
            )}
          </div>
          {meta && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {patients?.length} of {meta?.total} doctors
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
};

export default PatientsList;
