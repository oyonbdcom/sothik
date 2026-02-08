export default function LoadingSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/4 mb-10" />
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-[2rem]" />
        ))}
      </div>
      <div className="h-64 bg-slate-50 rounded-3xl" />
    </div>
  );
}
