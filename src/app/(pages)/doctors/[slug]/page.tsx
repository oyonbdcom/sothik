import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import ServerPagination from "@/components/server-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { avatar, femaleAvatar } from "@/config/site";
import { IMembershipResponse } from "@/interface/diagnostic-membership";
import { getSingleDoctor } from "@/service/doctor.service";
import { getMembershipsBySlug } from "@/service/membership.service";
import { ExternalLink, Globe, MapPin, Star, Stethoscope } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MembershipCard from "./components/membarship-card";

interface DoctorProps {
  params: Promise<{ slug: string }>;
  searchParams: { page: string };
}

export async function generateMetadata({
  params,
}: DoctorProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getSingleDoctor(slug);
  return {
    title: doctor
      ? `ডা. ${doctor.user.name} | বিশেষজ্ঞ প্রোফাইল`
      : "ডাক্তার পাওয়া যায়নি",
    description: `${doctor?.user?.name} এর অ্যাপয়েন্টমেন্ট নিন। জানুন তার চেম্বার এবং স্পেশালাইজেশন।`,
  };
}

export default async function DoctorDetailsPage({
  params,
  searchParams,
}: DoctorProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = Number(sParams?.page) || 1;
  const limit = 12;

  // সমান্তরালভাবে ডাটা ফেচিং (Parallel Fetching)
  const [doctor, membershipResponse] = await Promise.all([
    getSingleDoctor(slug),
    getMembershipsBySlug(slug, page, limit),
  ]);

  if (!doctor) {
    return (
      <main className="py-20 text-center font-bold text-slate-800">
        ডাক্তার পাওয়া যায়নি
      </main>
    );
  }

  const memberships = membershipResponse?.data || [];
  const meta = membershipResponse?.meta;
  const imageSrc =
    doctor?.user?.image || (doctor.gender === "MALE" ? avatar : femaleAvatar);
  const ratingText = Number(doctor.averageRating || 0).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12">
      <Hero
        title={doctor.user.name}
        breadcrumbs={[
          { label: "ডাক্তার তালিকা", href: "/doctors" },
          { label: doctor.user.name, href: "#" },
        ]}
      />

      {/* -mt-12 বা mt-10 দিয়ে হিরোর সাথে লেয়ারিং পোলিশ করা হয়েছে */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ==================== সাইডবার সেকশন ==================== */}
          {/* lg:col-span-4 শুধুমাত্র ডেস্কটপে দেখাবে, মোবাইলে এটি নিচে চলে যাবে (অর্ডার কন্ট্রোল) */}
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              {/* প্রোফাইল কভার ও ওভারল্যাপ ইমেজ */}
              <div className="relative h-40 bg-gradient-to-tr from-primary-600 to-blue-400">
                <div className="absolute -bottom-10 left-6">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-50">
                    <Image
                      src={imageSrc}
                      alt={doctor.user.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* সাইডবার কন্টেন্ট */}
              <div className="p-6 pt-14 space-y-5">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight">
                    {doctor.user.name}
                  </h1>
                  <p className="text-primary-600 font-bold text-xs mt-1 uppercase tracking-wide">
                    {doctor?.department?.name} (
                    {doctor.position || "General Doctor"})
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl w-fit text-xs font-bold">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-amber-500"
                  />
                  {ratingText} ({doctor.reviewsCount || 0} রিভিউ)
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-primary-500 border border-slate-100 shrink-0">
                      <Stethoscope size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        কর্মস্থল
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {doctor.hospital}
                      </p>
                    </div>
                  </div>

                  {doctor?.website && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl text-primary-500 border border-slate-100 shrink-0">
                        <Globe size={18} />
                      </div>
                      <Link
                        href={doctor.website}
                        target="_blank"
                        className="text-sm font-bold text-slate-700 hover:text-primary-600 flex items-center gap-1 transition-colors"
                      >
                        ব্যক্তিগত ওয়েবসাইট <ExternalLink size={14} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* ==================== মোবাইল ভিউ কার্ড ==================== */}
          {/* শুধুমাত্র মোবাইল এবং ট্যাবলেটে দেখাবে (lg:hidden) */}
          <div className="block lg:hidden w-full bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm mt-16">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 shadow-inner">
                <Image
                  src={imageSrc}
                  alt={doctor.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 flex-1">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {doctor.user.name}
                </h1>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">
                  {doctor?.department?.name} (
                  {doctor.position || "General Doctor"})
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {doctor?.hospital}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs font-bold pt-1">
                  <Star size={14} fill="currentColor" /> {ratingText}
                  <span className="text-slate-400">
                    ({doctor.reviewsCount || 0} রিভিউ)
                  </span>
                </div>

                {doctor?.website && (
                  <Link
                    href={doctor.website}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary-600 mt-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
                  >
                    <Globe size={14} /> ব্যক্তিগত ওয়েবসাইট
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ==================== রাইট কলাম (Tabs Content) ==================== */}
          <div className="lg:col-span-8 w-full">
            <Tabs defaultValue="chambers" className="w-full">
              <TabsList className="w-full justify-start h-14 bg-white border border-slate-200/60 rounded-2xl p-1 mb-6 shadow-sm">
                <TabsTrigger
                  value="chambers"
                  className="flex-1 md:flex-none md:px-10 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all text-sm"
                >
                  চেম্বার সমুহ ({memberships.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 md:flex-none md:px-10 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all text-sm"
                >
                  পেশেন্ট রিভিউ ({doctor.reviewsCount || 0} )
                </TabsTrigger>
              </TabsList>

              {/* চেম্বার ট্যাব */}
              <TabsContent
                value="chambers"
                className="focus-visible:outline-none"
              >
                {memberships.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {memberships.map(
                        (item: IMembershipResponse, idx: number) => (
                          <MembershipCard
                            key={item?.id || idx}
                            membership={item}
                          />
                        ),
                      )}
                    </div>
                    {meta && meta.totalPage > 1 && (
                      <div className="flex justify-center pt-6">
                        <ServerPagination meta={meta} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <MapPin className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium italic">
                      কোনো সক্রিয় চেম্বার তথ্য পাওয়া যায়নি।
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* রিভিউ ট্যাব */}
              <TabsContent
                value="reviews"
                className="focus-visible:outline-none"
              >
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8">
                  <ReviewPage targetId={doctor.id} type="doctor" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
