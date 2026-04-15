import { ClinicCard } from "@/components/clinic/clinic-card";
import { IClinicResponse } from "@/interface/clinic";

export default function DiagnosticCenter({
  diagnostic,
}: {
  diagnostic: IClinicResponse[];
}) {
  return (
    <section className="container py-16 px-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            শীর্ষ <span className="text-blue-700">ডায়াগনস্টিক সেন্টার</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            বিশ্বস্ত প্রতিষ্ঠানে সেরা চিকিৎসা সেবা
          </p>
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          সব সেন্টার →
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {diagnostic?.slice(0, 4).map((center, i) => {
          return <ClinicCard key={center?.id} clinic={center} />;
        })}
      </div>
    </section>
  );
}
