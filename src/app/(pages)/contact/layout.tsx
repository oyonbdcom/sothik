import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: {
    default: `${siteConfig.siteName} - স্মার্ট ডিজিটাল স্বাস্থ্যসেবা`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "দিনাজপুরের সেরা ডাক্তার এবং ডায়াগনস্টিক সেন্টারের তথ্য ও সিরিয়াল বুকিং করুন Sasthik (সাস্থিক)-এ। আমরা স্বাস্থ্যসেবাকে করছি সহজ এবং ডিজিটাল।",
  keywords: [
    "Sasthik",
    "সাস্থিক",
    "Doctor Booking Bangladesh",
    "Dinajpur Healthcare",
    "Dinajpur Diagnostic Center", // লোকাল এসইও-র জন্য জরুরি
    "Digital Prescription",
  ],

  openGraph: {
    title: `Sasthik - স্মার্ট ডিজিটাল স্বাস্থ্যসেবা`,
    description:
      "দিনাজপুরের স্বাস্থ্যসেবাকে ডিজিটাল করতে আমাদের সাথে যুক্ত হোন।",
    url: "https://sasthik.com",
    siteName: "Sasthik",
    locale: "bn_BD",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
