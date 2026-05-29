import { CheckCircle2 } from "lucide-react";

export const VerifiedBadge = ({ size = "p-1", iconSize = "w-2.5 h-2.5" }) => (
  <div
    className={`flex items-center justify-center ${size} rounded-full bg-white shadow-sm border border-slate-100`}
  >
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className={`${iconSize} text-white`} />
    </div>
  </div>
);
