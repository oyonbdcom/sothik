// app/auth/sign-in/page.tsx
import Loader from "@/components/loader";
import { Suspense } from "react";
import LoginPageContent from "./components/sign-in-form";

export default function SignInPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginPageContent />
    </Suspense>
  );
}
