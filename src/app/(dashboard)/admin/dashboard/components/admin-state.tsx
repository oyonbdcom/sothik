"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

interface AdminStatsProps {
  doctorsCount: number;
  totalPatient: number;
  totalClinics: number;
  monthlyRevenue?: number;
}

export default function AdminStats({
  doctorsCount,
  totalPatient,
  totalClinics,
  monthlyRevenue = 125600,
}: AdminStatsProps) {
  const stats = [
    {
      title: "Total Doctors",
      value: doctorsCount,
      icon: Stethoscope,
      color: "bg-blue-50 text-blue-600",
      iconColor: "bg-blue-100",
      trend: 12.5,
    },
    {
      title: "Total Patients",
      value: totalPatient.toLocaleString(),
      icon: Users,
      color: "bg-green-50 text-green-600",
      iconColor: "bg-green-100",
      trend: 8.3,
    },
    {
      title: "Active Clinics",
      value: totalClinics,
      icon: Building2,
      color: "bg-purple-50 text-purple-600",
      iconColor: "bg-purple-100",
      trend: 0,
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-orange-50 text-orange-600",
      iconColor: "bg-orange-100",
      trend: 15.2,
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                {stat.trend > 0 && (
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">
                      +{stat.trend}% from last month
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.iconColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
