import { StatusBadgeProps } from "@/interface/appointment";
import { cn } from "@/lib/utils/utils";

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<
    string,
    { class: string; label: string; iconColor: string }
  > = {
    PENDING: {
      label: "পেন্ডিং ",
      class: "bg-amber-50 text-amber-700 border-amber-200",
      iconColor: "text-amber-500",
    },
    SCHEDULED: {
      label: "শিডিউলড ",
      class: "bg-blue-50 text-blue-700 border-blue-200",
      iconColor: "text-blue-500",
    },
    RESCHEDULED: {
      label: "রিশিডিউলড ",
      class: "bg-purple-50 text-purple-700 border-purple-200",
      iconColor: "text-purple-500",
    },
    COMPLETED: {
      label: "কমপ্লিটেড ",
      class: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-500",
    },
    CANCELLED: {
      label: "ক্যানসেলড (বাতিল)",
      class: "bg-rose-50 text-rose-700 border-rose-200",
      iconColor: "text-rose-500",
    },
  };
  const current = styles[status] || styles.SCHEDULED;

  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest",
        current.class,
      )}
    >
      {current.label}
    </span>
  );
}
