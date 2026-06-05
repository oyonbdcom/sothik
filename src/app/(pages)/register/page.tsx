// app/login/page.tsx
import Loader from "@/components/loader";
import { Suspense } from "react";
import RegisterForm from "./component/register-form";
export const metadata = {
  title: "নতুন অ্যাকাউন্ট তৈরি করুন",
  description:
    "Sasthik প্ল্যাটফর্মে আজই রেজিস্ট্রেশন করুন এবং ডিজিটাল স্বাস্থ্যসেবার সকল সুবিধা উপভোগ করুন।",
  robots: {
    index: false,
    follow: false,
  },
};
export default function SignUpPage() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterForm />
    </Suspense>
  );
}
