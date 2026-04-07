/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Download, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function MedicalRecordGrid({ appointment, showRecords }: any) {
  if (!showRecords) return null;
  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "medical-report";
      document.body.appendChild(link);
      link.click();

      // ক্লিনআপ
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // যদি কোনো কারণে ফেল করে, তবে ব্যাকআপ হিসেবে নতুন ট্যাবে ওপেন হবে
      window.open(url, "_blank");
    }
  };
  return (
    <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6">
        <h4 className="font-bold text-slate-800 dark:text-white">
          সংযুক্ত ফাইলসমূহ
        </h4>
        <Badge className="bg-indigo-600 px-2 py-0.5 rounded-full">
          {appointment.medicalRecords?.length || 0}
        </Badge>
      </div>

      {/* Content Section */}
      <PhotoProvider
        speed={() => 300}
        maskOpacity={0.9}
        toolbarRender={({ onScale, scale, onRotate, rotate, index }) => {
          const currentItem = appointment.medicalRecords[index];

          return (
            <div className="flex items-center gap-2 md:gap-4 px-4 py-1.5 bg-black/40 backdrop-blur-lg rounded-full mr-4 border border-white/10 shadow-2xl transition-all">
              {/* Zoom Out Button */}
              <button
                className="p-2 hover:text-blue-400 text-white/90 disabled:opacity-30 disabled:hover:text-white transition-colors"
                onClick={() => onScale(scale - 0.5)}
                disabled={scale <= 1}
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              {/* Zoom Level Display */}
              <span className="text-xs font-mono text-white/70 min-w-[45px] text-center select-none">
                {Math.round(scale * 100)}%
              </span>
              {/* Zoom In Button */}
              <button
                className="p-2 hover:text-blue-400 text-white/90 disabled:opacity-30 transition-colors"
                onClick={() => onScale(scale + 0.5)}
                disabled={scale >= 4}
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <div className="w-[1px] h-4 bg-white/20 mx-1" /> {/* Separator */}
              {/* Rotate Button */}
              <button
                className="p-2 hover:text-blue-400 text-white/90 transition-colors"
                onClick={() => onRotate(rotate + 90)}
                title="Rotate"
              >
                <RotateCcw size={18} />
              </button>
              {/* Download Button */}
              <button
                className="p-2 hover:text-green-400 text-white/90 transition-colors"
                title="Download to Device"
                onClick={() =>
                  handleDownload(
                    currentItem.document,
                    `${currentItem.name}-${index + 1}`,
                  )
                }
              >
                <Download size={20} />
              </button>
            </div>
          );
        }}
      >
        {appointment.medicalRecords?.length ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {appointment.medicalRecords.map((item: any, index: number) => (
              <RecordItem key={index} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </PhotoProvider>
    </div>
  );
}

const RecordItem = ({ item }: { item: any }) => {
  return (
    <PhotoView src={item.document || ""}>
      <div className="group relative aspect-[4/4] rounded-xl overflow-hidden cursor-zoom-in border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <Image
          width={400}
          height={400}
          src={item.document}
          alt={item.name || "Medical Record"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] bg-white/90 text-black px-2 py-1 rounded shadow-sm font-medium">
            দেখুন
          </span>
        </div>

        {/* Name Tag (Optional) */}
        {item.name && (
          <div className="absolute bottom-0 inset-x-0 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <p className="text-[10px] text-center truncate font-medium dark:text-slate-200">
              {item.name}
            </p>
          </div>
        )}
      </div>
    </PhotoView>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
    <p className="text-sm text-slate-400 italic">কোনো রেকর্ড পাওয়া যায়নি</p>
  </div>
);
