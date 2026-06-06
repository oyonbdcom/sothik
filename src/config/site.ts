// ইমপোর্ট করার কোনো প্রয়োজন নেই। সরাসরি পাথ ব্যবহার করুন।

export const ogAbout = "/og-about.png";
export const ogContact = "/og-contact.png";
export const ogDoctorListing = "/og-doctor-listing.png";
export const ogImage = "/og-image.png";

export const facebook = "/social/facebook-1.png";
export const linkedin = "/social/linkedin-1.png";
export const twitter = "/social/twitter-1.png";
export const youtube = "/social/youtube.png";
export const logo = "/logo.png";
export const thumbnail = "/thumbnail.png";

export const avatar = "/doctor.png";
export const femaleAvatar = "/female-doctor.png";

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
    email: "sasthik@mail.com",
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
