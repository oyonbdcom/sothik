import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sasthik.com";

  return {
    rules: {
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
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
