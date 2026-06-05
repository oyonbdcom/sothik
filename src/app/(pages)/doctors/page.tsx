import DoctorFilterForm from "@/app/(pages)/doctors/components/doctor-filter-form";
import SearchDoctorCard from "@/app/(pages)/doctors/components/search-doctor-card";

import { Hero } from "@/components/hero";
import { NotFound } from "@/components/not-found";
import ServerPagination from "@/components/server-pagination";
import { siteConfig } from "@/config/site";
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
  isEmergency?: "true";
}

// --- SEO: Highly Optimized Dynamic Metadata ---
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://susthio.com";

  // এসইও এবং লোকাল কিওয়ার্ড টার্গেটিংয়ের জন্য ডায়নামিক ভ্যালু প্রিপারেশন
  const deptEn = params.department ? `${params.department} ` : "";
  const deptBn = params.department ? `${params.department} বিশেষজ্ঞ ` : "";
  const cityEn = params.district ? `in ${params.district}` : "Bangladesh";
  const cityBn = params.district ? `${params.district}-এ` : "বাংলাদেশে";

  const urlParams = new URLSearchParams();
  if (params.department) urlParams.set("department", params.department);
  if (params.district) urlParams.set("district", params.district);
  urlParams.set("membership", "true");
  if (params.page) urlParams.set("page", params.page);

  const canonicalPath = urlParams.toString()
    ? `/doctors?${urlParams.toString()}`
    : "/doctors";

  const fullUrl = `${baseUrl}${canonicalPath}`;

  const pageTitle = `Best ${deptEn}Specialist Doctors ${cityEn} | সেরা ${deptBn}ডাক্তার তালিকা ${cityBn} | ${siteConfig.siteName}`;
  const pageDesc = `${cityBn} সেরা, অভিজ্ঞ এবং রেজিস্টার্ড ${deptBn}ডাক্তারদের খুঁজুন। ডাক্তারদের চেম্বারের ঠিকানা, ভিজিট ফি, রেটিং দেখুন এবং ঘরে বসেই সহজে সিরিয়াল বুকিং করুন অনলাইনে।`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: fullUrl,
      siteName: `${siteConfig.siteName}`,
      images: [
        {
          url: `https://res.cloudinary.com/dnpcna4up/image/upload/v1780641866/sasthik/doctor-listing_n5h9wp.png`,
          width: 1200,
          height: 630,
          alt: `Find Best ${deptEn}Doctors ${cityEn} on SusthiO`,
        },
      ],
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [
        `https://res.cloudinary.com/dnpcna4up/image/upload/v1780641866/sasthik/doctor-listing_n5h9wp.png`,
      ],
    },
  };
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://susthio.com";

  const query = {
    page: Number(params.page) || 1,
    limit: 12,
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

  // ২. SEO: JSON-LD Structured Data for ItemList & Physician
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.department
      ? `${params.department} Specialist Doctors List - SusthiO`
      : `Doctor List - ${siteConfig?.siteName || "SusthiO"}`,
    description:
      "অনলাইনে সহজে বিশেষজ্ঞ ডাক্তার খুঁজুন এবং অ্যাপয়েন্টমেন্ট বুক করুন।",
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doc: IDoctorResponse, index: number) => {
      const doctorUrl = `${baseUrl}/doctors/${doc.slug || doc.id}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          "@id": doctorUrl,
          name: doc.user.name,
          medicalSpecialty: doc.specialization,
          imageSrc: doc?.user?.image
            ? doc.user.image
            : doc?.gender === "MALE"
              ? siteConfig.maleDoctor
              : siteConfig.femaleDoctor,
          url: doctorUrl,
          telephone: siteConfig?.contact.phone || "",
          ...(doc.averageRating && Number(doc.averageRating) > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: doc.averageRating,
                  reviewCount: doc.averageRating || 1,
                  bestRating: "5",
                  worstRating: "1",
                },
              }
            : {}),
        },
      };
    }),
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
                জন ডাক্তার পাওয়া গেছে
              </p>
            </header>

            {doctors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {doctors.map((doctor: IDoctorResponse, index: number) => (
                    <SearchDoctorCard
                      key={doctor?.slug || doctor?.id || index}
                      doctor={doctor}
                    />
                  ))}
                </div>

                {/* ৩. URL-based Pagination */}
                {meta && meta.totalPage > 1 && (
                  <nav className="flex justify-center mt-10 border-slate-100">
                    <ServerPagination meta={meta} />
                  </nav>
                )}
              </>
            ) : (
              <NotFound
                title="কোনো ডাক্তার পাওয়া যায়নি"
                description="দুঃখিত, আপনার দেওয়া ফিল্টার অনুযায়ী কোনো তথ্য পাওয়া যায়নি। অন্যভাবে চেষ্টা করুন।"
              />
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
