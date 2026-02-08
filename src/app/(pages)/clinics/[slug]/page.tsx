import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import { RatingField } from "@/components/ui/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IClinicResponse } from "@/interface/clinic";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { getSingleClinic } from "@/service/clinic.service";
import { Building2, Clock, Phone, ShieldCheck, Users2 } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import MembershipCard from "./components/membarship-card";

interface DoctorProps {
  params: Promise<{ slug: string }>;
}

// SEO এবং মেটাডেটা অপ্টিমাইজেশন
export async function generateMetadata({
  params,
}: DoctorProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getSingleClinic(slug);
  const clinicName = clinic?.user?.name || "ক্লিনিক প্রোফাইল";

  return {
    title: `${clinicName} | হেলথ-পোর্টাল`,
    description: `${clinicName} এ অভিজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট বুক করুন। জানুন ঠিকানা, কাজের সময় এবং রোগীদের অভিজ্ঞতা।`,
    alternates: {
      canonical: `/clinics/${slug}`,
    },
  };
}

export default async function ClinicDetailsPage({ params }: DoctorProps) {
  const { slug } = await params;
  const clinic: IClinicResponse = await getSingleClinic(slug);

  if (!clinic)
    return (
      <div className="py-20 text-center font-medium">
        ক্লিনিক প্রোফাইলটি খুঁজে পাওয়া যায়নি।
      </div>
    );

  // Google Search Console-এর জন্য Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: clinic?.user?.name,
    image: clinic?.user?.image,
    telephone: clinic?.phoneNumber,
    address: {
      "@type": "PostalAddress",
      addressLocality: clinic?.city || "Bangladesh",
      addressCountry: "BD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: clinic?.averageRating || "5",
      reviewCount: clinic?.reviewsCount || "1",
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      {/* গুগল এসইও স্কিমা ইনজেকশন */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        title={
          <span className="text-slate-900 dark:text-white">
            {clinic?.user?.name}
          </span>
        }
        breadcrumbs={[
          { label: "ক্লিনিক খুঁজুন", href: "/clinics" },
          { label: clinic?.user?.name, href: `/clinics/${clinic?.id}` },
        ]}
      />

      <main className="container py-12 px-4">
        <div className="lg:col-span-8 space-y-10">
          <section className="relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 shadow-sm p-6 transition-all">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* ক্লিনিক লোগো */}
              <div className="relative aspect-square w-full md:w-48 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
                {clinic?.user?.image ? (
                  <Image
                    src={clinic?.user?.image}
                    alt={clinic?.user?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <Building2 className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {clinic?.user?.name}
                      </h1>
                      {clinic?.user?.isPhoneVerified && (
                        <ShieldCheck className="w-6 h-6 text-blue-500 fill-blue-50" />
                      )}
                    </div>

                    {/* Google Ads-এর জন্য হাইলাইটেড কল বাটন */}
                    {clinic?.phoneNumber && (
                      <a
                        href={`tel:${clinic.phoneNumber}`}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-bold"
                      >
                        <Phone className="w-4 h-4 fill-current" />
                        এখনই কল করুন
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <RatingField value={clinic?.averageRating || 0} readOnly />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {clinic?.averageRating}
                      <span className="text-slate-400 font-medium ml-1.5 underline underline-offset-4 decoration-slate-200">
                        ({clinic?.reviewsCount} টি রিভিউ)
                      </span>
                    </span>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 text-blue-700">
                      <Users2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {clinic?.memberships?.length || 0} জন বিশেষজ্ঞ
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 text-emerald-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        খোলা: {clinic?.openingHour || "সকাল ০৯:০০ টা"}
                      </span>
                    </div>
                  </div>

                  {/* মোবাইল ইউজারদের জন্য কল বাটন */}
                  {clinic?.phoneNumber && (
                    <a
                      href={`tel:${clinic.phoneNumber}`}
                      className="flex md:hidden items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      কল করুন: {clinic.phoneNumber}
                    </a>
                  )}

                  {clinic?.description && (
                    <div className="relative">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-widest text-[10px]">
                        ক্লিনিক সম্পর্কে
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl">
                        {clinic.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 bg-transparent mb-8 text-sm">
              <TabsTrigger
                value="doctors"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-6 pb-4 text-sm font-bold transition-all"
              >
                মেডিকেল টিম
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-6 pb-4 text-sm font-bold transition-all"
              >
                পেশেন্ট রিভিউ
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="doctors"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              {clinic?.memberships?.map((membership) => {
                if (!membership) return null;

                return (
                  <MembershipCard
                    key={membership.id}
                    membership={membership as unknown as IMembershipResponse}
                  />
                );
              })}
            </TabsContent>

            <TabsContent
              value="reviews"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl border p-6">
                <ReviewPage targetId={clinic?.userId} targetType="CLINIC" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
