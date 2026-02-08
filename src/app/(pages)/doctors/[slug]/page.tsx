import SearchDoctorCard from "@/components/doctors/search-doctor-card";
import { Hero } from "@/components/hero";
import ReviewPage from "@/components/reviews/review-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDoctorResponse } from "@/interface/doctor";
import { getSingleDoctor } from "@/service/doctor.service";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import MembershipCard from "./components/membarship-card";

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
          title={<span className="text-primary">ডা. {doctor?.user?.name}</span>}
          breadcrumbs={[
            { label: "ডাক্তারগণ", href: "/doctors" },
            { label: doctor?.user?.name || "প্রোফাইল" },
          ]}
        />
      </header>

      <main className="container py-10">
        <div className="space-y-8">
          {/* Main Professional Card */}
          <section aria-label="ডাক্তারের সংক্ষিপ্ত পরিচিতি">
            <SearchDoctorCard doctor={doctor} profileButton={false} />
          </section>

          {/* AdSense Placement - Top of Content (Placeholder) */}
          {/* <div className="google-ads text-center py-4 bg-muted/20">
             [বিজ্ঞাপনের জন্য জায়গা]
          </div> */}

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

          {/* AdSense Placement - Bottom of Content (Placeholder) */}
          {/* <div className="google-ads text-center py-4 bg-muted/20 mt-8">
             [বিজ্ঞাপনের জন্য জায়গা]
          </div> */}
        </div>
      </main>
    </article>
  );
}
