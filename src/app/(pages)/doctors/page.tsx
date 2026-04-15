// app/doctors/page.tsx
import DoctorFilterForm from "@/app/(pages)/doctors/components/doctor-filter-form";
import SearchDoctorCard from "@/app/(pages)/doctors/components/search-doctor-card";

import { Hero } from "@/components/hero";
import { NotFound } from "@/components/not-found";
import ServerPagination from "@/components/server-pagination";
import { IDoctorResponse } from "@/interface/doctor";
import { getAllDoctors } from "@/service/doctor.service";
import { Metadata } from "next";

interface SearchParams {
  searchTerm?: string;
  page?: string;
  department?: string;
  district?: string;
  rating?: string;
  area?: string;
  gender?: "MALE" | "FEMALE";
}

// --- SEO: Dynamic Metadata Generation ---
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://susthio.com";

  const deptName = params.department ? `${params.department} ` : "";
  const cityName = params.district ? `in ${params.district}` : "Bangladesh";

  const urlParams = new URLSearchParams();
  if (params.department) urlParams.set("department", params.department);
  if (params.district) urlParams.set("district", params.district);
  if (params.page) urlParams.set("page", params.page);
  const canonicalPath = urlParams.toString()
    ? `/doctors?${urlParams.toString()}`
    : "/doctors";

  return {
    title: `Best ${deptName}Specialist Doctors ${cityName} | বুক করুন অনলাইনে | SusthiO`,
    description: `Book appointments with the best ${deptName}specialist doctors ${cityName}. View ratings, experience, and chamber details online on SusthiO.`,
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    openGraph: {
      title: `${deptName}Specialist Doctors ${cityName}`,
      description: `Find and book the best ${deptName}doctors online.`,
      url: `${baseUrl}${canonicalPath}`,
      siteName: "SusthiO",
      images: [{ url: `${baseUrl}/og-image.jpg` }], // আপনার একটি ডিফল্ট OG ইমেজ থাকা উচিত
      type: "website",
    },
  };
}
export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = {
    page: Number(params.page) || 1,
    limit: 12, // Professional standard limit
    department: params.department,
    searchTerm: params.searchTerm,
    district: params.district,
    area: params.area,
    gender: params.gender,
    minRating: params.rating,
    deactivate: "false",
    membership: true,
  };

  // ১. ডেটা ফেচিং
  const response = await getAllDoctors(query);
  const doctors = response?.data || [];
  const meta = response?.meta;

  // ২. SEO: JSON-LD Structured Data for Physician List
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Doctor List - SusthiO",
    itemListElement: doctors.map((doc: IDoctorResponse, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Physician",
        name: doc.user.name,
        medicalSpecialty: doc.specialization,
        image: doc.user.image,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: doc.averageRating,
          bestRating: "5",
          worstRating: "1",
          ratingCount: "10", // Example
        },
      },
    })),
  };

  return (
    <main className="bg-background min-h-screen">
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        title={"সেরা বিশেষজ্ঞ ডাক্তার খুঁজুন ও অ্যাপয়েন্টমেন্ট নিন"}
        breadcrumbs={[{ label: "ডাক্তার তালিকা", href: "/doctors" }]}
      />

      <section className="bg-card/30 backdrop-blur-md py-10">
        <div className="container mx-auto px-4">
          <aside className="w-full mb-8">
            <DoctorFilterForm />
          </aside>

          <article className="flex-1">
            <header className="border-b border-primary/5 pb-6 mb-8">
              <h2
                id="main-listing-title"
                className="text-2xl font-black text-slate-800"
              >
                {params?.department
                  ? `${params?.department} বিশেষজ্ঞ`
                  : "সকল ডাক্তার"}
              </h2>
              <p className="text-muted-foreground mt-1 font-medium">
                মোট{" "}
                <span className="text-emerald-600 font-bold">
                  {meta?.total || 0}
                </span>{" "}
                জন ডাক্তার পাওয়া গেছে
              </p>
            </header>

            {doctors.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {doctors.map((doctor: IDoctorResponse) => (
                    <li key={doctor.id} className="h-full">
                      <SearchDoctorCard doctor={doctor} />
                    </li>
                  ))}
                </ul>

                {/* ৩. Professional URL-based Pagination */}
                {meta && meta.totalPage > 1 && (
                  <nav className="flex justify-center   border-slate-100">
                    <ServerPagination meta={meta} />
                  </nav>
                )}
              </>
            ) : (
              <NotFound
                title="কোনো ডাক্তার পাওয়া যায়নি"
                description="দুঃখিত, আপনার দেওয়া ফিল্টার অনুযায়ী কোনো তথ্য পাওয়া যায়নি। অন্যভাবে চেষ্টা করুন।"
              />
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
