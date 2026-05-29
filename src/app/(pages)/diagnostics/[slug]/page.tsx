import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import ServerPagination from "@/components/server-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IMembershipResponse } from "@/interface/diagnostic-membership";
import { getDiagnosticByIdentifier } from "@/service/diagnostic.service";
import { getMembershipsBySlug } from "@/service/membership.service";
import { Building, Globe, MapPin, Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MembershipCard from "./components/membarship-card";

interface DiagnosticsProps {
  params: Promise<{ slug: string }>;
  searchParams: {
    page: string;
  };
}

export async function generateMetadata({
  params,
}: DiagnosticsProps): Promise<Metadata> {
  const { slug } = await params;
  const diagnostic = await getDiagnosticByIdentifier(slug);
  const diagnosticName = diagnostic?.user?.name || "ডায়াগনস্টিক প্রোফাইল";

  return {
    title: `${diagnosticName} | হেলথ-পোর্টাল`,
    description: `${diagnosticName} এ অভিজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট বুক করুন।`,
    alternates: { canonical: `/diagnostic/${slug}` },
  };
}

export default async function DiagnosticsDetailsPage({
  params,
  searchParams,
}: DiagnosticsProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = Number(sParams?.page) || 1;
  const limit = 4;

  const [diagnostic, membershipResponse] = await Promise.all([
    getDiagnosticByIdentifier(slug),
    getMembershipsBySlug(slug, page, limit),
  ]);

  if (!diagnostic) {
    return (
      <main className="py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          ডায়াগনস্টিক পাওয়া যায়নি
        </h1>
      </main>
    );
  }

  const memberships = membershipResponse?.data || [];
  const meta = membershipResponse?.meta;

  const ratingText = Number(diagnostic.averageRating || 0).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]  ">
      <Hero
        title={diagnostic?.user?.name}
        breadcrumbs={[
          { label: "ডায়াগনস্টিক", href: "/diagnostics" },
          { label: diagnostic?.user?.name, href: "#" },
        ]}
      />

      <main className="container  lg:mt-12  ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ==================== সাইডবার সেকশন ==================== */}
          {/* lg:col-span-4 শুধুমাত্র ডেস্কটপে দেখাবে, মোবাইলে এটি নিচে চলে যাবে (অর্ডার কন্ট্রোল) */}
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <section className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              {/* প্রোফাইল কভার ও ওভারল্যাপ ইমেজ */}
              <div className="relative h-40 bg-gradient-to-tr from-primary-600 to-blue-400">
                <div className="absolute -bottom-10 left-6">
                  {/* flex, items-center, justify-center যোগ করা হয়েছে যাতে আইকনটি একদম মাঝখানে বসে */}
                  <div className="relative w-28 h-28 rounded-2xl border-4 border-white shadow-md bg-slate-50 flex items-center justify-center overflow-hidden group">
                    {diagnostic?.user?.image ? (
                      <Image
                        src={diagnostic.user.image}
                        alt={diagnostic?.user?.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      // আইকন রেন্ডারিং একদম ক্লিন এবং সেন্টারড হবে
                      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
                        <Building
                          className="w-10 h-10 text-slate-300 transition-transform duration-300 group-hover:scale-105"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* সাইডবার কন্টেন্ট */}
              <div className="p-6 pt-14 space-y-5">
                {/* ক্লিনিকের নাম ও ক্যাটাগরি/টাইপ */}

                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {diagnostic?.user?.name}
                </h1>

                {/* রেটিং সেকশন */}
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl w-fit text-xs font-bold">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-amber-500"
                  />
                  {ratingText} ({diagnostic?.reviewsCount || 0} রিভিউ)
                </div>

                <hr className="border-slate-100" />

                {/* ক্লিনিকের ইনফরমেশন (আইকন ও লেবেল ক্লিনিকের উপযোগী করা হয়েছে) */}
                <div className="space-y-4">
                  {diagnostic?.address && (
                    <div className="flex items-start gap-3">
                      {/* ক্লিনিকের জন্য Stethoscope বদলে MapPin বা Building আইকন পারফেক্ট */}
                      <div className="p-2 bg-slate-50 rounded-xl text-primary-500 border border-slate-100 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          ক্লিনিক লোকেশন
                        </p>
                        <p className="text-sm font-bold text-slate-700 leading-snug">
                          {diagnostic.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ক্লিনিক ওয়েবসাইট */}

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-xl text-primary-500 border border-slate-100 shrink-0">
                      <Globe size={18} />
                    </div>
                    <Link
                      href={diagnostic.website || "#"}
                      target="_blank"
                      className="text-sm font-bold text-slate-700 hover:text-primary-600 flex items-center gap-1 transition-colors"
                    >
                      অফিসিয়াল ওয়েবসাইট
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ==================== মোবাইল ভিউ কার্ড ==================== */}
          {/* শুধুমাত্র মোবাইল এবং ট্যাবলেটে দেখাবে (lg:hidden) */}
          <div className="block lg:hidden w-full bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm mt-16">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              {/* ==================== ইমেজ বা আইকন কন্টেইনার ==================== */}
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shrink-0 shadow-inner flex items-center justify-center overflow-hidden group">
                {diagnostic?.user?.image ? (
                  <Image
                    src={diagnostic.user.image}
                    alt={diagnostic?.user?.name || "Diagnostics"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  // এখানে w-full h-full এবং relative যোগ করা হয়েছে যাতে ব্যাকগ্রাউন্ড গ্রেডিয়েন্টটি ঠিকঠাক বসে
                  <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <Building
                      className="w-10 h-10 text-slate-300 transition-transform duration-300 group-hover:scale-105"
                      strokeWidth={1.5}
                    />
                    {/* প্রিমিয়াম শ্যাডো ইফেক্ট */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-200/40 to-transparent pointer-events-none" />
                  </div>
                )}
              </div>

              {/* ==================== ক্লিনিক ইনফো কন্টেন্ট ==================== */}
              <div className="space-y-2 flex-1 min-w-0 w-full">
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight truncate">
                  {diagnostic?.user?.name}
                </h1>
                {/* ক্লিনিক ক্যাটাগরি বা টাইপ */}

                {/* ডক্টরের হাসপাতালের বদলে ক্লিনিকের নিজস্ব ঠিকানা */}
                {diagnostic?.address && (
                  <p className="text-xs font-medium text-slate-500 line-clamp-2">
                    {diagnostic.address}
                  </p>
                )}

                {/* রেটিং সেকশন */}
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs font-bold pt-1">
                  <Star size={14} fill="currentColor" />
                  <span>{ratingText}</span>
                  <span className="text-slate-400 font-normal">
                    ({diagnostic?.reviewsCount || 0} রিভিউ)
                  </span>
                </div>

                {/* ওয়েবসাইট বাটন */}

                <div className="pt-1">
                  <Link
                    href={diagnostic?.website || "#"}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary-600 bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-xl border border-slate-100 transition-all shadow-sm"
                  >
                    <Globe
                      size={14}
                      className="text-slate-400 group-hover:text-primary-500"
                    />
                    অফিসিয়াল ওয়েবসাইট
                  </Link>
                </div>
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
                  ডাক্তার সমূহ ({memberships?.length})
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 md:flex-none md:px-10 h-full rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all text-sm"
                >
                  পেশেন্ট রিভিউ ({diagnostic?.reviewsCount || 0} )
                </TabsTrigger>
              </TabsList>

              {/* চেম্বার ট্যাব */}
              <TabsContent
                value="chambers"
                className="focus-visible:outline-none"
              >
                {memberships?.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {memberships.map((item: IMembershipResponse) => (
                        <MembershipCard key={item?.id} membership={item} />
                      ))}
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
                  <ReviewPage targetId={diagnostic.id} type="diagnostic" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
