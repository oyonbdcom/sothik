import { UserRole } from "@/types";
import RegisterForm from "./components/register-form";

export default async function Page({
  params,
}: {
  params: Promise<{ role: UserRole }>;
}) {
  const { role } = await params;
  return <RegisterForm role={role} />;
}
