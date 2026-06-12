/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IAppointmentResponse } from "@/interface/appointment";

import { bdStartOfDay } from "@/lib/utils/utils";
import { useGetDoctorDashboardAppointmentsQuery } from "@/redux/api/appointmentApi";
import { useGetDoctorDiagnosticsNameQuery } from "@/redux/api/membershipApi";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
};

const DoctorDashboard = () => {
  const [diagId, setDiagId] = useState<string>("all");

  const [date, setDate] = useState<string>();

  // =========================
  // DIAGNOSTICS
  // =========================
  const { data: diagnostics = [], isLoading: diagnosticsLoading } =
    useGetDoctorDiagnosticsNameQuery(undefined);

  // =========================
  // APPOINTMENTS
  // =========================
  const { data: apptData, isLoading: appointmentLoading } =
    useGetDoctorDashboardAppointmentsQuery({
      diagId: diagId === "all" ? undefined : diagId,
      date: bdStartOfDay(date),
    });

  const appointments: IAppointmentResponse[] = apptData?.appointments ?? [];
  const stats: any = apptData?.stats ?? {
    total: 0,

    scheduled: 0,
    cancelled: 0,
    completed: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Doctor Appointment Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage patients, appointments & diagnostics in real time
            </p>
          </div>

          <div className="text-sm text-slate-500">
            {new Date().toDateString()}
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total</p>
              <h2 className="text-3xl font-bold text-indigo-600">
                {stats?.total}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <h2 className="text-3xl font-bold text-yellow-600">
                {stats.scheduled}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Completed</p>
              <h2 className="text-3xl font-bold text-green-600">
                {stats.completed}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <h2 className="text-3xl font-bold text-red-600">
                {stats.cancelled}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* ================= FILTER ================= */}
        <Card>
          <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
            <select
              value={diagId}
              onChange={(e) => setDiagId(e.target.value)}
              className="h-11 rounded-md border px-3 text-sm bg-white"
            >
              <option value="all">All Diagnostic Centers</option>

              {diagnostics.map((item: any) => (
                <option key={item.diagnosticId} value={item.diagnosticId}>
                  {item.diagnosticName}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-md border px-3 text-sm"
            />
          </CardContent>
        </Card>

        {/* ================= TABLE ================= */}
        <Card>
          <CardContent className="p-0">
            {appointmentLoading || diagnosticsLoading ? (
              <div className="py-20 text-center text-sm text-slate-500">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="text-lg font-semibold">No Appointments Found</h3>
                <p className="text-sm text-slate-500">
                  Try changing filter or date
                </p>
              </div>
            ) : (
              <>
                {/* ================= MOBILE ================= */}
                <div className="md:hidden">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className={`border-b p-4 flex justify-between ${
                        appt.isEmergency ? "bg-red-50" : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{appt.patientName}</p>

                          {appt.isEmergency && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              EMERGENCY
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-slate-500">
                          {appt.contactNumber}
                        </p>

                        <p className="text-xs text-slate-400">
                          {appt?.diagnostic?.user?.name}
                        </p>
                      </div>

                      {appt?.status && (
                        <Badge className={statusStyles[appt.status]}>
                          {appt.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* ================= DESKTOP ================= */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Diagnostic</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {appointments.map((appt) => (
                        <TableRow
                          key={appt.id}
                          className={`hover:bg-slate-50 ${
                            appt.isEmergency
                              ? "bg-red-50 border-l-4 border-red-500"
                              : ""
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {appt.patientName}
                              </span>

                              {appt.isEmergency && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>{appt.contactNumber}</TableCell>

                          <TableCell>
                            {appt?.diagnostic?.user?.name || "N/A"}
                          </TableCell>

                          {appt?.status && (
                            <TableCell>
                              <Badge className={statusStyles[appt.status]}>
                                {appt.status}
                              </Badge>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
