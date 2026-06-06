/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllDiagnostics } from "@/service/diagnostic.service";
import { getAllDoctors } from "@/service/doctor.service"; // আপনার সার্ভিস ফাইল ইমপোর্ট করুন
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sasthik.com";

  const allDoctors = await getAllDoctors({ limit: 1000 });
  const doctorLinks = (allDoctors?.data || []).map((doc: any) => ({
    url: `${baseUrl}/doctors/${doc.slug}`,
    lastModified: new Date().toISOString(),
  }));
  const allDiagnostics = await getAllDiagnostics({ limit: 1000 });
  const diagnosticsLinks = (allDiagnostics?.data || []).map((dig: any) => ({
    url: `${baseUrl}/diagnostics/${dig.slug}`,
    lastModified: new Date().toISOString(),
  }));

  // ২. স্ট্যাটিক পেজগুলো
  const routes = ["", "/doctors", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...doctorLinks, ...diagnosticsLinks];
}
