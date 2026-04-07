import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDoctorResponse } from "@/interface/doctor";
import { getSingleDoctor } from "@/service/doctor.service";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import MembershipCard from "./components/membarship-card";

import { avatar, femaleAvatar } from "@/config/site";
import { Award, BadgeCheck, Building2, Star, Stethoscope } from "lucide-react";
import Image from "next/image";

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
    <article className="min-h-screen bg-background dark:bg-slate-950">
      {/* Hero Section - SEO Friendly Header */}
      <header>
        <Hero
          title={"বিশেষজ্ঞ ডাক্তার খুঁজুন"}
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
            aria-label="ডাক্তারের সংক্ষিপ্ত পরিচিতি"
            className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]"
          >
            {/* Decorative Background Element for Premium Look */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Section 1: Visual Identity with Enhanced Frame */}
                <div className="relative shrink-0">
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 dark:ring-slate-800 shadow-xl">
                    <Image
                      src={
                        doctor?.user?.image ||
                        (doctor.gender === "MALE" ? avatar : femaleAvatar)
                      }
                      alt={doctorName}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  {/* Verification Tag - Bottom Centered for Balance */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <div className="bg-blue-600 rounded-full p-0.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Section 2: Content Area */}
                <div className="flex-1 w-full text-center md:text-left space-y-4">
                  <div className="space-y-2">
                    {/* Specialization Badge */}

                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                      ডা. {doctor?.user?.name}
                    </h1>
                  </div>

                  {/* Professional Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-3 p-3 bg-blue-50  text-primary  rounded-2xl border border-slate-100/50  ">
                      <div className="bg-white   p-2 rounded-xl shadow-sm">
                        <Stethoscope className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium   ">
                        {doctor?.specialization}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                        <Award className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {doctor?.position}
                      </span>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                        {doctor?.hospital}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Trust Bar (Rating & Reviews) */}
                  <div className="flex items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(doctor?.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {Number(doctor?.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <p className="text-sm font-bold text-slate-500">
                      <span className="text-blue-600">
                        {doctor?.reviewsCount || 0}
                      </span>{" "}
                      পেশেন্ট রিভিউ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Tabs */}
          <section className="space-y-4">
            <Tabs defaultValue="chambers" className="w-full">
              <TabsList className="w-full text-sm justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
                <TabsTrigger
                  value="chambers"
                  className="rounded-none text-sm border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-1 font-semibold"
                >
                  চেম্বার ও ক্লিনিক
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 px-1 font-semibold text-sm"
                >
                  পেশেন্ট রিভিউ
                </TabsTrigger>
              </TabsList>

              {/* Chambers Content */}
              <TabsContent value="chambers" className="pt-6">
                <div className="space-y-6">
                  <header className="sr-only">
                    <h2>চেম্বার এবং ক্লিনিক লিস্ট</h2>
                  </header>
                  {doctor?.memberships && doctor.memberships.length > 0 ? (
                    doctor.memberships.map((item) => (
                      <MembershipCard key={item?.id} membership={item} />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed">
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
                  <ReviewPage targetId={doctor?.userId} targetType="DOCTOR" />
                </section>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </article>
  );
}
