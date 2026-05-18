/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Download,
  ImageIcon,
  Maximize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function MedicalRecordGrid({ appointment, showRecords }: any) {
  if (!showRecords) return null;

  const records = appointment.medicalRecords || [];

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "medical-document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="p-5 lg:p-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
      {/* Header Info */}

      <PhotoProvider
        speed={() => 300}
        maskOpacity={0.97}
        toolbarRender={({ onScale, scale, onRotate, rotate, index }) => {
          const currentItem = records[index];
          return (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl mb-6">
              <button
                className="text-white/70 hover:text-blue-400 transition-colors"
                onClick={() => onScale(scale - 0.5)}
                disabled={scale <= 1}
              >
                <ZoomOut size={22} />
              </button>
              <span className="text-xs font-mono text-white/50 w-12 text-center select-none">
                {Math.round(scale * 100)}%
              </span>
              <button
                className="text-white/70 hover:text-blue-400 transition-colors"
                onClick={() => onScale(scale + 0.5)}
                disabled={scale >= 4}
              >
                <ZoomIn size={22} />
              </button>
              <div className="w-[1px] h-5 bg-white/10 mx-1" />
              <button
                className="text-white/70 hover:text-blue-400 transition-colors"
                onClick={() => onRotate(rotate + 90)}
              >
                <RotateCcw size={20} />
              </button>
              <button
                className="ml-1 h-9 w-9 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-all"
                onClick={() =>
                  handleDownload(currentItem.document, `record-${index + 1}`)
                }
              >
                <Download size={18} />
              </button>
            </div>
          );
        }}
      >
        {records.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {records.map((item: any, idx: number) => (
              <PhotoView key={idx} src={item.document || ""}>
                <div className="group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-zoom-in">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white dark:bg-black border border-slate-100 dark:border-slate-800">
                    <Image
                      fill
                      src={item.document}
                      alt={item.name || "Medical Record"}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Floating Badge */}
                    {(item.isPrescription || item.type === "PRESCRIPTION") && (
                      <div className="absolute top-2 left-2 shadow-lg">
                        <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          Prescription
                        </span>
                      </div>
                    )}

                    {/* View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white text-slate-900 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Maximize2 size={12} />
                        বড় করে দেখুন
                      </div>
                    </div>
                  </div>

                  {/* Caption Section */}
                  <div className="mt-3 px-1">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                      {item.name || "নথিপত্র নাম নেই"}
                    </p>
                    <div className="flex items-center justify-between mt-1 opacity-60">
                      <span className="text-[9px] font-medium uppercase tracking-widest">
                        {item.type || "IMAGE"}
                      </span>
                      <ImageIcon size={10} />
                    </div>
                  </div>
                </div>
              </PhotoView>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
            <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
              <ImageIcon size={24} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium italic">
              কোনো ফাইল খুঁজে পাওয়া যায়নি
            </p>
          </div>
        )}
      </PhotoProvider>
    </div>
  );
}
