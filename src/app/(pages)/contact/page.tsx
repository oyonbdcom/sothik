import ContactClient from "./contact-client";

export const metadata = {
  title: "যোগাযোগ করুন | Sasthik",
  description:
    "দিনাজপুরের সেরা ডাক্তার এবং ডায়াগনস্টিক সেন্টারের তথ্য ও সিরিয়াল বুকিংয়ের জন্য Sasthik (সাস্থিক)-এর সাথে যোগাযোগ করুন। আমরা আপনার স্বাস্থ্যসেবাকে ডিজিটাল করতে বদ্ধপরিকর।",
  keywords: [
    "Sasthik Contact",
    "সাস্থিক যোগাযোগ",
    "দিনাজপুর ডাক্তার বুকিং",
    "Sasthik Helpline Dinajpur",
    "Digital Healthcare Bangladesh",
  ],

  openGraph: {
    title: "যোগাযোগ করুন | Sasthik - আপনার ডিজিটাল স্বাস্থ্যসেবা",
    description:
      "দিনাজপুরের সেরা ডাক্তার এবং ডায়াগনস্টিক সেন্টারের সিরিয়াল বুকিং ও তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।",
    url: "https://sasthik.com/contact",
    siteName: "Sasthik",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dnpcna4up/image/upload/v1780636459/sasthik/contact_cbzjpq.png",
        width: 1200,
        height: 630,
        alt: "Sasthik Contact Us",
      },
    ],
  },
  // ২. টুইটার/এক্স কার্ড সাপোর্ট
  twitter: {
    card: "summary_large_image",
    title: "যোগাযোগ করুন | Sasthik",
    description:
      "দিনাজপুরের ডাক্তার এবং ডায়াগনস্টিক সেন্টারের সিরিয়াল বুকিংয়ের জন্য সাস্থিক-এর সাথে যোগাযোগ করুন।",
    images: [
      "https://res.cloudinary.com/dnpcna4up/image/upload/v1780636459/sasthik/contact_cbzjpq.png",
    ],
  },
};
export default function Page() {
  return <ContactClient />;
}
