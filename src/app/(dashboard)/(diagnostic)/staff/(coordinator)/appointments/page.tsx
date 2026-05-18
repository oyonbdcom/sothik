import CoordinatorGuard from "../../components/coordinator-gard";
import ReceptionistDashboard from "../../components/receptionist-dashboard";

export default function Page() {
  return (
    <CoordinatorGuard>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <ReceptionistDashboard />
      </div>
    </CoordinatorGuard>
  );
}
