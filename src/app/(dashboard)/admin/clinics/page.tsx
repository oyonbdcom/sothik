import ClinicList from "./components/clinics-list";

export default async function ClinicPage() {
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      <ClinicList />
    </div>
  );
}
