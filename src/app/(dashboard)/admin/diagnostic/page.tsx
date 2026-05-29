import DiagnosticManagement from "./components/diagnostics-list";

export default async function DiagnosticPage() {
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      <DiagnosticManagement />
    </div>
  );
}
