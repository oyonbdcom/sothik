import DoctorList from "./components/doctor-list";

export default async function DoctorPage() {
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      <DoctorList />
    </div>
  );
}
