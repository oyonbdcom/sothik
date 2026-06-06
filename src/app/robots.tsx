import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sasthik.com";

  return {
    rules: [
      // ১. সাধারণ সার্চ ইঞ্জিনের জন্য নিয়ম
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/area_manager/",
          "/admin/",
          "/manager/",
          "/patient/",
          "/diagnostic/",
        ],
      },
      // ২. গুগল অ্যাডসেন্স ও অ্যাডস ক্রলারের জন্য নিয়ম
      {
        userAgent: [
          "Mediapartners-Google",
          "AdsBot-Google",
          "AdsBot-Google-Mobile",
        ],
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
