import ForgetPasswordClient from "./client";
export const metadata = {
  title: "পাসওয়ার্ড রিসেট করুন",
  description:
    "আপনার Sasthik অ্যাকাউন্টের পাসওয়ার্ড ভুলে গেছেন? এখানে আপনার মোবাইল নম্বর বা ইমেইল দিয়ে সহজেই পাসওয়ার্ড রিসেট করুন।",
  robots: {
    index: false,
    follow: false,
  },
};
export default function page() {
  return <ForgetPasswordClient />;
}
