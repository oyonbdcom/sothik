import ContactClient from "./contact-client";

export const metadata = {
  title: "যোগাযোগ করুন | Sasthik",
  description:
    "দিনাজপুরের সেরা ডাক্তার এবং ডায়াগনস্টিক সেন্টারের তথ্য ও সিরিয়াল বুকিংয়ের জন্য Sasthik (সাস্থিক)-এর সাথে যোগাযোগ করুন। আমরা আপনার স্বাস্থ্যসেবাকে ডিজিটাল করতে বদ্ধপরিকর।",
  keywords: [
    "Sasthik Contact",
    "সাস্থিক যোগাযোগ",
    "দিনাজপুর ডাক্তার বুকিং",
    "Sasthik Helpline Dinajpur",
    "Digital Healthcare Bangladesh",
  ],
};

export default function Page() {
  return <ContactClient />;
}
