// app/login/page.tsx
import Loader from "@/components/loader";
import { Suspense } from "react";
import RegisterForm from "./component/register-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterForm />
    </Suspense>
  );
}
