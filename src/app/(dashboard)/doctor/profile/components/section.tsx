/* eslint-disable @typescript-eslint/no-explicit-any */
export function SectionCard({ title, icon, children }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-blue-500 text-base">{icon}</span>}
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}
