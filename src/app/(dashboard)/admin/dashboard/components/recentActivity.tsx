"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  UserPlus,
} from "lucide-react";

interface Activity {
  id: string;
  type: "appointment" | "registration" | "subscription" | "review" | "payment";
  user: string;
  action: string;
  details?: string;
  time: string;
  status?: "success" | "pending" | "warning";
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      id: "1",
      type: "appointment",
      user: "Dr. Sarah Johnson",
      action: "New appointment booked",
      details: "Cardiology consultation",
      time: "10 minutes ago",
      status: "success",
    },
    {
      id: "2",
      type: "registration",
      user: "Dr. Alex Morgan",
      action: "New doctor registered",
      details: "Dermatology specialist",
      time: "25 minutes ago",
      status: "pending",
    },
    {
      id: "3",
      type: "subscription",
      user: "Westside Clinic",
      action: "Upgraded to PREMIUM plan",
      details: "Annual subscription",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: "4",
      type: "review",
      user: "Patient Review",
      action: "New 5-star review received",
      details: "Dr. Michael Chen - Pediatrics",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: "5",
      type: "payment",
      user: "NeuroCare Institute",
      action: "Monthly subscription processed",
      details: "Amount: $299.00",
      time: "3 hours ago",
      status: "success",
    },
  ];

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "registration":
        return <UserPlus className="h-4 w-4" />;
      case "subscription":
        return <DollarSign className="h-4 w-4" />;
      case "review":
        return <FileText className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getColor = (type: Activity["type"]) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-600";
      case "registration":
        return "bg-green-100 text-green-600";
      case "subscription":
        return "bg-purple-100 text-purple-600";
      case "review":
        return "bg-yellow-100 text-yellow-600";
      case "payment":
        return "bg-orange-100 text-orange-600";
    }
  };

  const getStatusColor = (status?: Activity["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "warning":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        >
          <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
            {getIcon(activity.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{activity.action}</p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.user} • {activity.details}
                </p>
              </div>
              {activity.status && (
                <Badge
                  variant="outline"
                  className={getStatusColor(activity.status)}
                >
                  {activity.status}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full">
          View All Activities
        </Button>
      </div>
    </div>
  );
}
