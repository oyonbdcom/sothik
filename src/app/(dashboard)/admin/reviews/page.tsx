import ReviewsList from "./components/reviews-list";

export default async function AdminPatientPage() {
  return (
    <div className="border p-6 bg-card rounded-md space-y-4">
      <ReviewsList />
    </div>
  );
}
