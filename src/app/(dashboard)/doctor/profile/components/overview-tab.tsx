import { Doctor } from "@/interface/doctor";
import { SectionCard } from "./section";

export default function OverviewTab({ doctor }: { doctor: Doctor }) {
  return (
    <div>
      <div className="space-y-4">
        <SectionCard title="Contact & Details" icon="🏥">
          <div className="space-y-4">
            {[
              { icon: "🏥", label: "Hospital", val: doctor?.hospital },
              {
                icon: "💊",
                label: "Specialization",
                val: doctor?.specialization,
              },
              { icon: "🪪", label: "Position", val: doctor?.position },
              {
                icon: "✉️",
                label: "Phone number",
                val: doctor?.user?.phoneNumber,
                phoneNumber: true,
              },
              {
                icon: "👤",
                label: "Gender",
                val: doctor?.gender === "MALE" ? "Male" : "Female",
              },
            ].map((row) => (
              <div
                key={row?.label}
                className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-sm"
              >
                <div className="flex items-center gap-2 sm:w-28 flex-shrink-0">
                  <span className="text-base">{row?.icon}</span>
                  <span className="text-gray-400 font-medium sm:font-normal">
                    {row.label}
                  </span>
                </div>

                <span
                  className={`font-medium sm:font-semibold break-all ${
                    row?.phoneNumber ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {row?.val || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Education" icon="🎓">
          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gray-100" />
            <div className="space-y-0">
              {doctor?.educations?.map((edu, i) => (
                <div key={i} className="flex gap-4 py-3">
                  <div className="flex flex-col items-center z-10">
                    <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {edu?.degree}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {edu?.institution}
                    </p>
                    <span className="inline-block mt-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {edu?.passingYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Practice Areas" icon="📍">
          <div className="space-y-4">
            {doctor?.practices?.map((p, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm">📌</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {p?.area}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pl-5">
                  {p?.centers?.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
