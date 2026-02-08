/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils/utils";
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface ImageViewerProps {
  state: {
    isOpen: boolean;
    appointment: any[];
    currentIndex: number;
  };
  zoomLevel: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  // This prop allows us to jump to a specific thumbnail
  onSelectIndex: (index: number) => void;
}

export const ImageViewerModal = ({
  state,
  zoomLevel,
  onClose,
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut,
  onSelectIndex,
}: ImageViewerProps) => {
  const currentRecord = state.appointment[state.currentIndex];

  // 1. Keyboard Shortcuts
  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, onClose, onNext, onPrev]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [state.isOpen]);

  if (!state.isOpen || !currentRecord) return null;
  const getDownloadUrl = (url: string) => {
    try {
      const cloudUrl = new URL(url);
      cloudUrl.pathname = cloudUrl.pathname.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      return cloudUrl.toString();
    } catch {
      return url;
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* --- Header Controls --- */}
      <div className="flex items-center justify-between p-4 text-white bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg leading-tight">
            {currentRecord.name || "Medical Document"}
          </h3>
          <p className="text-xs text-gray-400">
            {state.currentIndex + 1} of {state.appointment.length} • Updated{" "}
            {new Date(currentRecord.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center bg-white/10 border border-white/10 rounded-full px-2 py-1">
            <button
              onClick={onZoomOut}
              className="p-2 hover:text-blue-400 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-xs font-mono w-10 text-center select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={onZoomIn}
              className="p-2 hover:text-blue-400 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          <button
            className="p-2.5 bg-white/10 hover:bg-blue-600 rounded-full transition-all"
            title="Download/Open Original"
          >
            <a
              href={
                currentRecord?.document
                  ? getDownloadUrl(currentRecord.document)
                  : "#"
              }
            >
              <DownloadIcon className="w-5 h-5" />
            </a>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 bg-rose-600 hover:bg-rose-700 rounded-full transition-all shadow-lg"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* --- Main Viewport --- */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Navigation Arrows */}
        {state.appointment.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-6 z-20 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all backdrop-blur-md"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={onNext}
              className="absolute right-6 z-20 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all backdrop-blur-md"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        {/* The Image Wrapper with Zoom */}
        <div
          className="relative transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <Image
            src={currentRecord.document}
            alt="Medical Record"
            width={1600}
            height={1200}
            className="max-h-[75vh] w-auto object-contain rounded-sm shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* --- Bottom Thumbnail Strip --- */}
      {state.appointment.length > 1 && (
        <div className="p-6 flex justify-center gap-3 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent z-10">
          {state.appointment.map((record, idx) => (
            <button
              key={record.id}
              onClick={() => onSelectIndex(idx)}
              className={cn(
                "relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0",
                state.currentIndex === idx
                  ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/40"
                  : "border-white/10 opacity-40 hover:opacity-100 hover:border-white/30"
              )}
            >
              <Image
                src={record.document}
                alt="thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
