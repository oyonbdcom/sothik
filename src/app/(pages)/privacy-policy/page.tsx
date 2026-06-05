import PrivacyPolicyClient from "./privacy-policy-client";
export const metadata = {
  title: "প্রাইভেসি পলিসি",
  description:
    "Sasthik (সাস্থিক) প্ল্যাটফর্মে আপনার ব্যক্তিগত তথ্য ও স্বাস্থ্য রেকর্ডের নিরাপত্তা এবং গোপনীয়তা নীতি সম্পর্কে বিস্তারিত জানুন।",
  keywords: [
    "Sasthik privacy policy",
    "সাস্থিক প্রাইভেসি পলিসি",
    "তথ্য সুরক্ষা নীতি",
  ],
};
export default function PrivacyPolicyPage() {
  return (
    <>
      <PrivacyPolicyClient />
    </>
  );
}
