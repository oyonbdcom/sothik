import { Hero } from "@/components/hero";
import { IClinicResponse } from "@/interface/clinic";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { getSingleClinic } from "@/service/clinic.service";
import {
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Stethoscope,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DoctorMembershipCard from "./components/membarship-card";

interface DoctorProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DoctorProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getSingleClinic(slug);
  const clinicName = clinic?.user?.name || "ক্লিনিক প্রোফাইল";

  return {
    title: `${clinicName} | হেলথ-পোর্টাল`,
    description: `${clinicName} এ অভিজ্ঞ ডাক্তারদের সাথে অ্যাপয়েন্টমেন্ট বুক করুন।`,
    alternates: { canonical: `/diagnostic/${slug}` },
  };
}

export default async function ClinicDetailsPage({ params }: DoctorProps) {
  const { slug } = await params;
  const clinic: IClinicResponse = await getSingleClinic(slug);

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Building2 size={48} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">
          ক্লিনিক প্রোফাইলটি খুঁজে পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  const isAvailable = clinic?.memberships && clinic.memberships.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Hero
        title={clinic?.user?.name}
        breadcrumbs={[
          { label: "ডায়াগনস্টিক", href: "/diagnostic" },
          { label: clinic?.user?.name, href: "#" },
        ]}
      />

      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Clinic Info Card */}
          <div className="lg:col-span-4 space-y-6">
            <section className="sticky top-24 bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100">
                {clinic?.user?.image ? (
                  <Image
                    src={clinic.user.image}
                    alt={clinic.user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-400">
                    <Building2 size={48} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase mt-2">
                      No Image Available
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <VerifiedBadge />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {clinic?.user?.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide">
                    <Stethoscope size={14} />
                    ভেরিফাইড ক্লিনিক
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-blue-500">
                      <MapPin size={18} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {clinic?.address}, {clinic?.area?.name},{" "}
                      {clinic?.area?.district?.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-blue-500">
                      <Globe size={18} />
                    </div>
                    <Link
                      href="#"
                      className="text-sm font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                    >
                      ওয়েবসাইট ভিজিট করুন <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>

                <div
                  className={`mt-6 p-4 rounded-2xl flex items-center justify-between ${isAvailable ? "bg-emerald-50" : "bg-rose-50"}`}
                >
                  <div className="flex items-center gap-2">
                    <Clock
                      size={16}
                      className={
                        isAvailable ? "text-emerald-600" : "text-rose-600"
                      }
                    />
                    <span
                      className={`text-sm font-bold ${isAvailable ? "text-emerald-700" : "text-rose-700"}`}
                    >
                      {isAvailable ? "বুকিং অপশন চালু" : "বর্তমানে বন্ধ"}
                    </span>
                  </div>
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Doctors List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-xl text-white">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">বিশেষজ্ঞগণ</h2>
              </div>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                মোট {clinic?.memberships?.length || 0} জন
              </span>
            </div>

            {isAvailable ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3  gap-3">
                {clinic?.memberships?.map((membership) => (
                  <DoctorMembershipCard
                    key={membership.id}
                    membership={membership as unknown as IMembershipResponse}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <p className="text-slate-400">
                  এই ক্লিনিকে বর্তমানে কোনো ডাক্তার তালিকাভুক্ত নেই।
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const VerifiedBadge = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border border-emerald-100">
    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  </div>
);
