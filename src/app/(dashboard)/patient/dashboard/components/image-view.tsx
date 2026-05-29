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
    <div className="  bg-white   border-t border-slate-100   animate-in fade-in duration-500">
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
          <div className="flex flex-nowrap overflow-x-auto gap-4   px-1 scrollbar-hide snap-x">
            {records.map((item: any, idx: number) => (
              <PhotoView key={idx} src={item.document || ""}>
                <div className="group relative min-w-[140px] max-w-[140px] snap-start bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-95">
                  {/* Image Container with Fixed Ratio */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-50 dark:bg-black border border-slate-50 dark:border-slate-800">
                    <Image
                      fill
                      src={item.document}
                      alt={item.name || "Medical Record"}
                      className="object-cover"
                    />

                    {/* Compact Prescription Badge */}
                    {(item.isPrescription || item.type === "PRESCRIPTION") && (
                      <div className="absolute top-1 left-1">
                        <span className="bg-indigo-600/90 backdrop-blur-sm text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase">
                          Rx
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Minimal Info */}
                  <div className="mt-2">
                    <p className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate leading-tight">
                      {item.name || "নথিপত্র..."}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[8px] text-slate-400 font-medium uppercase">
                        {item.type || "IMG"}
                      </span>
                      <Maximize2 size={8} className="text-indigo-500" />
                    </div>
                  </div>
                </div>
              </PhotoView>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ImageIcon size={18} className="text-slate-300" />
            <p className="text-xs text-slate-400 font-medium italic">
              এখনো কোনো নথিপত্র নেই
            </p>
          </div>
        )}
      </PhotoProvider>
    </div>
  );
}
