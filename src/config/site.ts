import avatar from "@/public/images/doctor.png";
import femaleAvatar from "@/public/images/female-doctor.png";
import ogAbout from "@/public/images/og-about.png";
import ogContact from "@/public/images/og-contact.png";
import ogDoctorListing from "@/public/images/og-doctor-listing.png";
import ogImage from "@/public/images/og-image.png";
import facebook from "@/public/images/social/facebook-1.png";
import linkedin from "@/public/images/social/linkedin-1.png";
import twitter from "@/public/images/social/twitter-1.png";
import youtube from "@/public/images/social/youtube.png";
export { avatar, femaleAvatar, ogAbout, ogContact, ogDoctorListing, ogImage };
export const siteConfig = {
  sidebarBg: "none",
  siteName: "sasthik",
  name: "sasthik - Find & Book Doctors Online",
  address: "dinajpur sodor dinajpur",
  url: `${process.env.NEXT_PUBLIC_API_URL || "https://doccare.srikanto.site"}`,
  description:
    "Find and book appointments with top-rated doctors by specialty, location, and availability. Read verified patient reviews.",
  author: "Sebadar Team",

  // SEO Enhancements
  googleSiteVerification: "ABC123XYZ", // From Google Search Console
  googleAnalyticsId: "G-XXXXXXXXXX", // Google Analytics 4 ID
  ahrefsVerification: "12345abcde", // Ahrefs verification code

  // Content
  keywords: [
    "find doctors",
    "book doctor appointment",
    "healthcare providers",
    "medical specialists",
    "doctor ratings",
  ],

  // Social & Images
  twitterHandle: "@DoccareApp",
  ogImage: `https://res.cloudinary.com/dnpcna4up/image/upload/v1780635711/sasthik/og-image_a8zzcr.png`,
  maleDoctor:
    "https://res.cloudinary.com/dnpcna4up/image/upload/v1780645348/sasthik/doctor_rg8vdx.png",
  femaleDoctor:
    "https://res.cloudinary.com/dnpcna4up/image/upload/v1780645348/sasthik/doctor_rg8vdx.png",
  building:
    "https://res.cloudinary.com/dnpcna4up/image/upload/v1780647388/sasthik/print-392401977_eatmov.webp",
  logo: `/assets/logo.jpeg`,

  // Contact Information
  contact: {
    officeAddress: "Medical college mor , Sodor ,Dinajpur",
    phone: "+8801737813575",
  },

  socialLinks: [
    { name: "Facebook", url: "https://facebook.com/Doccare" },
    { name: "Twitter", url: "https://twitter.com/DoccareApp" },
    { name: "Instagram", url: "https://instagram.com/DoccareApp" },
    { name: "LinkedIn", url: "https://linkedin.com/company/Doccare" },
  ],
};
export const socials = [
  {
    icon: facebook,
    href: "https://www.facebook.com",
  },
  {
    icon: linkedin,
    href: "https://www.linkedin.com/",
  },
  {
    icon: youtube,
    href: "https://www.youtube.com",
  },
  {
    icon: twitter,
    href: "https://twitter.com",
  },
];
