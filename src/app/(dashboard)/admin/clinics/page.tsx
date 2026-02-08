import ClinicList from "./components/clinics-list";

interface ClinicPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ClinicPage({ searchParams }: ClinicPageProps) {
  return (
    <div className="w-full bg-card/50 p-4 rounded-lg shadow-md space-y-6">
      <ClinicList />
    </div>
  );
}
