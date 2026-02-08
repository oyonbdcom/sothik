import DoctorFilterForm from "@/components/doctors/doctor-filter-form";
import SearchDoctorCard from "@/components/doctors/search-doctor-card";
import { Hero } from "@/components/hero";
import { NotFound } from "@/components/not-found";
import Pagination from "@/components/PaginationComponents";
import { IDoctorResponse } from "@/interface/doctor";
import { getAllDoctors } from "@/service/doctor.service";

interface SearchParams {
  specialization?: string;
  searchTerm?: string;
  page?: string;
  department?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ১. প্যারামস রিজলভ করা
  const params = await searchParams;

  const query = {
    page: Number(params.page) || 1,
    specialization: params.specialization,
    department: params.department,
    searchTerm: params.searchTerm,
    district: params.district,
    gender: params.gender,
    active: true,
  };

  // ২. সার্ভার সাইড ডাটা ফেচিং
  const response = await getAllDoctors(query);
  const doctors = response?.data || [];
  const meta = response?.meta;

  // ৩. SEO: JSON-LD Structured Data
  // এটি গুগল সার্চ কনসোলকে আপনার লিস্ট ইনডেক্স করতে সাহায্য করে
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SebaWallet Doctor List",
    description: `${params.specialization || "বিশেষজ্ঞ"} ডাক্তারদের তালিকা এবং বুকিং সিস্টেম`,
    itemListElement: doctors.map((doctor: IDoctorResponse, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Physician",
        name: doctor.user?.name,
        image:
          doctor.user?.image || "https://yourdomain.com/default-doctor.png",
        medicalSpecialty: doctor.department || doctor.specialization,
        address: {
          "@type": "PostalAddress",
          addressLocality: doctor.district || "Bangladesh",
          addressCountry: "BD",
        },
      },
    })),
  };

  return (
    <main className="bg-background min-h-screen">
      {/* গুগল বটকে ডাটাবেজ স্ট্রাকচার বোঝানোর জন্য */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        title={"বিশেষজ্ঞ ডাক্তার খুঁজুন"}
        breadcrumbs={[{ label: "ডাক্তার তালিকা", href: "/doctors" }]}
      />

      <section
        className="bg-card/30 backdrop-blur-md py-10"
        aria-labelledby="main-listing-title"
      >
        <div className="container  ">
          {/* Aside: ফিল্টার সেকশন যা সাইডবারে থাকবে */}
          <aside className="w-full  ">
            <div>
              <h2
                id="filter-heading"
                className="text-lg font-semibold  text-slate-700"
              >
                ফিল্টার করুন
              </h2>
              <DoctorFilterForm />
            </div>
          </aside>

          {/* Article: মূল ডক্টর লিস্ট */}
          <article className="flex-1">
            <header className=" border-b border-primary/5 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2
                    id="main-listing-title"
                    className="text-2xl font-bold text-slate-800 dark:text-slate-100"
                  >
                    {params.specialization
                      ? `${params.specialization} বিশেষজ্ঞ`
                      : "সকল ডাক্তার"}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    মোট{" "}
                    <span className="text-primary font-bold">
                      {meta?.total || 0}
                    </span>{" "}
                    জন পেশাদার ডাক্তার পাওয়া গেছে
                  </p>
                </div>
              </div>
            </header>

            {/* ডক্টর কার্ডের তালিকা */}
            <div className="space-y-6">
              {doctors.length > 0 ? (
                <ul className="grid grid-cols-1 gap-6 list-none p-0">
                  {doctors.map((doctor: IDoctorResponse) => (
                    <li
                      key={doctor?.id}
                      className="transition-transform hover:scale-[1.01]"
                    >
                      <SearchDoctorCard doctor={doctor} profileButton />
                    </li>
                  ))}
                </ul>
              ) : (
                <NotFound
                  title="দুঃখিত, কোন ডাক্তার পাওয়া যায়নি"
                  description="আপনার সার্চ টার্ম পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                />
              )}

              {/* পেজিনেশন নেভিগেশন */}
              {meta?.total > meta?.limit && (
                <nav
                  aria-label="Pagination Navigation"
                  className="mt-16 flex justify-center border-t pt-8 border-slate-100"
                >
                  <Pagination
                    currentPage={meta.page}
                    totalPages={Math.ceil(meta?.total / meta?.limit)}
                  />
                </nav>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
