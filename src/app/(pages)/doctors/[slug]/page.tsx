import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDoctorResponse } from "@/interface/doctor";
import { getSingleDoctor } from "@/service/doctor.service";
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Stethoscope,
} from "lucide-react";
import { Metadata } from "next";
import MembershipCard from "./components/membarship-card";

import { avatar, femaleAvatar } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

interface DoctorProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DoctorProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getSingleDoctor(slug);

  // SEO Metadata with Bengali support
  return {
    title: doctor
      ? `ডা. ${doctor.user.name} | বিশেষজ্ঞ ডাক্তারের প্রোফাইল`
      : "ডাক্তার খুঁজে পাওয়া যায়নি",
    description: `${doctor?.user?.name} এর অ্যাপয়েন্টমেন্ট নিন। জানুন তার চেম্বার, বিশেষজ্ঞতা এবং পেশেন্ট রিভিউ সম্পর্কে।`,
  };
}

export default async function DoctorDetailsPage({ params }: DoctorProps) {
  const { slug } = await params;
  const doctor: IDoctorResponse = await getSingleDoctor(slug);
  const doctorName = ` ${doctor?.user?.name}`;
  const isAvailable = doctor?.memberships;
  const imageSrc =
    doctor?.user?.image || (doctor.gender === "MALE" ? avatar : femaleAvatar);
  if (!doctor) {
    return (
      <main className="py-20 text-center">
        <h1 className="text-2xl font-bold">
          ডাক্তারের প্রোফাইল খুঁজে পাওয়া যায়নি
        </h1>
      </main>
    );
  }

  return (
    <article className="min-h-screen bg-background  ">
      {/* Hero Section - SEO Friendly Header */}
      <header>
        <Hero
          title={doctorName}
          breadcrumbs={[
            { label: "ডাক্তার তালিকা", href: "/doctors" },
            { label: doctorName, href: "/doctors" },
          ]}
        />
      </header>

      <main className="container py-10">
        <div className="space-y-8">
          {/* Main Professional Card */}
          <section
            aria-label="Doctor Profile Summary"
            className=" bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className="  ">
              <div className="flex flex-col md:flex-row gap-   items-start">
                {/* Section 1: Minimalist Portrait */}
                {/* image */}
                <div className="relative hero-gradient   w-full md:w-64 h-52 md:h-64 p-6 flex items-end justify-between shrink-0">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                    <Image
                      src={imageSrc}
                      alt={doctorName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                      isAvailable
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      {isAvailable && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          isAvailable ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                    </span>
                    {isAvailable ? "বুকিং চলছে" : "সিরিয়াল পূর্ণ"}
                  </div>
                  <div className="absolute bottom-3  left-[102px]">
                    <VerifiedBadge />
                  </div>
                </div>
                {/* doctor content */}
                <div className="flex-1 p-6 space-y-2 text-left">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                        {doctor?.user?.name}
                      </h1>
                      <span className="hidden md:inline-block w-1 h-1 rounded-full bg-slate-300" />
                    </div>
                    <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                      {doctor?.specialization}
                    </span>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {doctor?.position}{" "}
                      {doctor?.position && (
                        <span className="text-slate-300 mx-1">|</span>
                      )}
                      {doctor?.hospital}
                    </p>
                  </div>

                  {/* Stats Row: Minimalist divider style */}
                  <div className="flex flex-wrap items-center  justify-start gap-y-4 gap-x-8">
                    {/* Rating */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                        <span className="font-bold text-amber-700">
                          {Number(doctor?.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400 font-medium">
                        ({doctor?.reviewsCount || 0} রিভিউ)
                      </span>
                    </div>

                    {/* Experience or other metric (Optional addition for balance) */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="p-1.5 bg-slate-100 rounded-md">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">
                        ভেরিফাইড বিশেষজ্ঞ
                      </span>
                    </div>

                    <Link
                      href={doctor?.website || "#"}
                      target="_blank"
                      className="flex items-center justify-center gap-2 text-slate-600 group-hover:text-blue-700 font-semibold"
                    >
                      {/* World/Globe Icon for Website context */}
                      <Globe className="w-4 h-4 transition-transform group-hover:rotate-12" />

                      <span>Website</span>

                      {/* External Link Arrow */}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  </div>

                  {/* Action / Tag Area */}
                  <div className="flex flex-wrap  justify-start gap-2 pt-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                      নতুন পেশেন্ট গ্রহণ করছেন
                    </span>

                    {/* <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">
                      অনলাইন কনসালটেশন
                    </span> */}
                  </div>
                </div>
                {/* Section 2: Refined Content */}
              </div>
            </div>
          </section>
          {/* Content Tabs */}
          <section className="space-y-4">
            <Tabs defaultValue="chambers" className="w-full">
              <TabsList className="w-full text-sm justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
                <TabsTrigger
                  value="chambers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:pt-3 data-[state=active]:text-blue-600  px-3 pb-3 text-sm font-bold transition-all"
                >
                  চেম্বার ও ক্লিনিক
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:pt-3 data-[state=active]:text-blue-600  px-3 pb-3 text-sm font-bold transition-all"
                >
                  পেশেন্ট রিভিউ
                </TabsTrigger>
              </TabsList>

              {/* Chambers Content */}
              <TabsContent value="chambers" className="p-0 pt-6">
                <div className="space-y-6">
                  <header className="sr-only">
                    <h2>চেম্বার এবং ক্লিনিক লিস্ট</h2>
                  </header>
                  {doctor?.memberships && doctor.memberships.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {doctor.memberships.map((item) => (
                        <MembershipCard key={item?.id} membership={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white   rounded-xl border-2 border-dashed">
                      <MapPin className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                      <p className="text-slate-500 italic">
                        কোনো সক্রিয় চেম্বার বা ক্লিনিক তথ্য পাওয়া যায়নি।
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Reviews Content */}
              <TabsContent value="reviews" className="pt-6">
                <section>
                  <header className="sr-only">
                    <h2>রোগীদের মতামত</h2>
                  </header>
                  <ReviewPage doctorId={doctor?.id} />
                </section>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </article>
  );
}
const VerifiedBadge = () => (
  <div className="flex items-center gap-1.5  p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-100">
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
  </div>
);
