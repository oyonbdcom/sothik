import { Hero } from "@/components/hero";
import Pagination from "@/components/PaginationComponents";
import { IClinicResponse } from "@/interface/clinic";
import { getAllClinics } from "@/service/clinic.service";
import { Building2 } from "lucide-react";
import { ClinicCard } from "./components/clinic-card";
import ClinicFilterForm from "./components/clinic-filtering-form";

interface SearchParams {
  specialization?: string;
  search?: string; // searchTerm এর বদলে URL থেকে আসা 'search'
  page?: string;
  department?: string;
  district?: string;
  gender?: "MALE" | "FEMALE";
}

export default async function DemoClinicsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // API-তে পাঠানোর জন্য কুয়েরি অবজেক্ট তৈরি
  const query = {
    page: Number(params.page) || 1,
    specialization: params.specialization,
    department: params.department,
    searchTerm: params.search, // URL থেকে আসা সার্চ কী-ওয়ার্ড
    district: params.district,
    gender: params.gender,
    active: true,
  };

  // সার্ভার সাইড ডাটা ফেচিং
  const response = await getAllClinics(query);
  const clinics = response?.data || [];
  const meta = response?.meta;

  return (
    <div className="bg-background min-h-screen">
      <Hero
        title={<span className="text-primary">ক্লিনিক খুঁজুন</span>}
        breadcrumbs={[{ label: "ক্লিনিক লিস্ট" }]}
      />

      <div className="container my-10">
        <article className="w-full">
          {/* ফিল্টার ফর্ম কম্পোনেন্ট */}
          <ClinicFilterForm />

          <header className="mb-6">
            <h1 className="text-lg font-semibold">
              মোট{" "}
              <span className="text-primary font-bold">{meta?.total || 0}</span>{" "}
              টি ক্লিনিক পাওয়া গেছে
            </h1>
          </header>

          <div className="space-y-6">
            {clinics.length > 0 ? (
              clinics.map((clinic: IClinicResponse) => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
                <Building2 className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-500 font-medium">
                  আপনার খোঁজা অনুযায়ী কোনো ক্লিনিক পাওয়া যায়নি।
                </p>
              </div>
            )}

            {/* প্যাজিনেশন লজিক */}
            {meta && meta.total > (meta.limit || 10) && (
              <div className="pt-12 flex justify-center">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
