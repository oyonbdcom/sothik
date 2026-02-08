/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, CheckCircle2, Clock, Users } from "lucide-react";
import StatCard from "./starCard";
export default function Status({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <StatCard
        title="মোট পেশেন্ট"
        value={stats.total}
        color="blue"
        icon={<Users />}
        change="সর্বমোট"
        trend="up"
      />
      <StatCard
        title="সম্পন্ন হয়েছে"
        value={stats.completed}
        color="emerald"
        icon={<CheckCircle2 />}
        change="সফলতা হার"
        trend="up"
      />
      <StatCard
        title="পেন্ডিং"
        value={stats.pending}
        color="amber"
        icon={<Clock />}
        change="পেন্ডিং"
        trend="up"
      />
      <StatCard
        title="শিডিউল্ড"
        value={stats.scheduled}
        color="amber"
        icon={<Clock />}
        change="শিডিউল্ড"
        trend="up"
      />
      <StatCard
        title="বাতিল হয়েছে"
        value={stats.cancelled}
        color="rose"
        icon={<AlertCircle />}
        change="অনুপস্থিত হার"
        trend="down"
      />
    </div>
  );
}
