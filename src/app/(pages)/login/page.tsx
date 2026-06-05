// app/login/page.tsx
import Loader from "@/components/loader";
import { Suspense } from "react";
import LoginPageContent from "./components/sign-in-form";
export const metadata = {
  title: "লগইন",
  description:
    "আপনার Sasthik অ্যাকাউন্টে লগইন করুন এবং আপনার স্বাস্থ্যসেবার তথ্য ও অ্যাপয়েন্টমেন্ট ম্যানেজ করুন।",
  robots: {
    index: false,
    follow: false,
  },
};
export default function SignInPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginPageContent />
    </Suspense>
  );
}
