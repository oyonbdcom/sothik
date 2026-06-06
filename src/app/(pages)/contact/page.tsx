import { ogContact } from "@/config/site";
import ContactClient from "./contact-client";
export const metadata = {
  title: "যোগাযোগ করুন ",
  description:
    "আপনার যেকোনো জিজ্ঞাসা বা সহায়তার জন্য সাস্থিক (Sasthik)-এর সাথে যোগাযোগ করুন। আমরা আপনার সেবায় সবসময় প্রস্তুত।",
  keywords: [
    "Contact Sasthik",
    "সাস্থিক যোগাযোগ",
    "দিনাজপুর স্বাস্থ্যসেবা হেল্পলাইন",
    "Sasthik Support",
    "Digital Healthcare Contact",
  ],

  openGraph: {
    title: "যোগাযোগ করুন | Sasthik - আমাদের সাথে কথা বলুন",
    description:
      "সাস্থিক-এর সাথে যোগাযোগের মাধ্যম এবং আমাদের সাপোর্ট টিমের সহায়তার জন্য এই পেজটি দেখুন।",
    url: "https://sasthik.com/contact", // এখানে সঠিক URL দিন
    siteName: "Sasthik",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: ogContact, // আগে থেকে ডিফাইন করা ভেরিয়েবল
        width: 1200,
        height: 630,
        alt: "Sasthik Contact Us",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "যোগাযোগ করুন | Sasthik",
    description:
      "আপনার যেকোনো জিজ্ঞাসা বা সহায়তার জন্য সাস্থিক (Sasthik)-এর সাথে যোগাযোগ করুন।",
    images: [ogContact],
  },
};
export default function Page() {
  return <ContactClient />;
}
