/* eslint-disable @typescript-eslint/no-explicit-any */
export const StatCard = ({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: number;
  color?: string;
}) => {
  const colors: any = {
    slate: "text-slate-700 bg-slate-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className={`p-3 rounded-2xl border ${colors[color]}`}>
      <p className="text-[11px] font-medium opacity-70">{label}</p>
      <p className="text-lg font-black">{value ?? 0}</p>
    </div>
  );
};
