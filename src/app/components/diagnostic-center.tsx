import { DiagnosticCard } from "@/components/diagnostic/diagnostic-card";
import { IDiagnosticResponse } from "@/interface/diagnostic";

export default function DiagnosticCenter({
  diagnostic,
}: {
  diagnostic: IDiagnosticResponse[];
}) {
  return (
    <section className="container py-14  ">
      <div className="flex items-end justify-between mb-8 lg:mb-12">
        <div className="">
          <h2 className="text-2xl font-bold text-slate-900">
            শীর্ষ <span className="text-blue-700">ডায়াগনস্টিক সেন্টার</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            বিশ্বস্ত প্রতিষ্ঠানে সেরা চিকিৎসা সেবা
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {diagnostic?.slice(0, 4).map((center, i) => {
          return <DiagnosticCard key={center?.id} diagnostic={center} />;
        })}
      </div>
    </section>
  );
}
