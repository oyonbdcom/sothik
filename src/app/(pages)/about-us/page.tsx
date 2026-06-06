import { ogAbout } from "@/config/site";
import AboutClient from "./about-client";
export const metadata = {
  title: "আমাদের সম্পর্কে | Sasthik",
  description:
    "Sasthik (সাস্থিক) আধুনিক প্রযুক্তির মাধ্যমে বাংলাদেশের, বিশেষ করে দিনাজপুরের প্রতিটি মানুষের জন্য সহজ, দ্রুত ও মানসম্মত স্বাস্থ্যসেবা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। জানুন আমাদের মিশন ও দল সম্পর্কে।",
  keywords: [
    "About Sasthik",
    "সাস্থিক আমাদের সম্পর্কে",
    "দিনাজপুর ডিজিটাল স্বাস্থ্যসেবা",
    "ডাক্তার বুকিং প্ল্যাটফর্ম",
    "Digital Healthcare Bangladesh",
  ],

  openGraph: {
    title: "আমাদের সম্পর্কে | Sasthik - আপনার ডিজিটাল স্বাস্থ্যসেবা",
    description:
      "আধুনিক প্রযুক্তির মাধ্যমে বাংলাদেশের প্রতিটি মানুষের জন্য সহজ ও মানসম্মত স্বাস্থ্যসেবা নিশ্চিত করতে সাস্থিক-এর মিশন ও উদ্যোগ সম্পর্কে জানুন।",
    url: "https://sasthik.com/about",
    siteName: "Sasthik",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: ogAbout,
        width: 1200,
        height: 630,
        alt: "Sasthik About Us",
      },
    ],
  },
  // টুইটার/এক্স কার্ড সাপোর্ট
  twitter: {
    card: "summary_large_image",
    title: "আমাদের সম্পর্কে | Sasthik",
    description:
      "আধুনিক প্রযুক্তির মাধ্যমে বাংলাদেশের প্রতিটি মানুষের জন্য সহজ ও মানসম্মত স্বাস্থ্যসেবা নিশ্চিত করতে সাস্থিক-এর মিশন ও উদ্যোগ সম্পর্কে জানুন।",
    images: [ogAbout],
  },
};
export default function Page() {
  return <AboutClient />;
}
