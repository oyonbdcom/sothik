"use client";
import { useAuth } from "@/hooks/useAuth";
import CoordinatorDashboard from "../components/coordinator-dashboard";
import ReceptionistDashboard from "../components/receptionist-dashboard";

const UnifiedDashboard = () => {
  // এই ডাটাগুলো আপনার Auth Context বা API থেকে আসবে
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50   font-sans text-slate-900">
      {user?.staff.staffType === "RECEPTIONIST" ? (
        <ReceptionistDashboard />
      ) : (
        <CoordinatorDashboard />
      )}
    </div>
  );
};

export default UnifiedDashboard;
