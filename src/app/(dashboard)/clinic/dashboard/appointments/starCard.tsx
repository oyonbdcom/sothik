import { StatCardProps, StatColor } from "@/interface/appointment";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  icon,
  color,
  trend,
}: StatCardProps) {
  const colorClasses: Record<StatColor, string> = {
    blue: "from-blue-500 to-blue-600 shadow-blue-100",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-100",
    amber: "from-amber-500 to-amber-600 shadow-amber-100",
    rose: "from-rose-500 to-rose-600 shadow-rose-100",
  };

  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold ${
            trend === "up" ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          <TrendingUp
            size={14}
            className={trend === "down" ? "rotate-180" : ""}
          />
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
      </div>
    </div>
  );
}
