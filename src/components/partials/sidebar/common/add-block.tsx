"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/utils";
import { Icon } from "@iconify/react";
import { X } from "lucide-react";
import { useState } from "react";

const AddBlock = ({
  className,
  title = "Sasthik Insights",
  desc = "Monitor your daily diagnostic appointments and staff performance in real-time.",
  buttonText = "View Analytics",
}: {
  className?: string;
  title?: string;
  desc?: string;
  buttonText?: string;
}) => {
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <>
      <div
        className={cn(
          "bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-6 pb-6 px-5 rounded-xl shadow-lg m-3 hidden xl:block",
          className,
        )}
      >
        <div className="text-xl font-bold mb-2">{title}</div>
        <div className="text-sm text-blue-100 mb-4">{desc}</div>

        <div className="mt-4 relative rounded-lg overflow-hidden border border-blue-400/30">
          {/* আপনি চাইলে এখানে আপনার ড্যাশবোর্ডের একটি প্রিভিউ ইমেজ দিতে পারেন */}
          <div className="h-32 bg-blue-900/50 flex items-center justify-center">
            <Icon
              icon="heroicons:chart-bar-square"
              className="w-12 h-12 text-blue-300"
            />
          </div>

          <Button
            size="icon"
            className="rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40"
            onClick={() => setOpenVideo(true)}
          >
            <Icon
              icon="heroicons:play-16-solid"
              className="w-6 h-6 text-white"
            />
          </Button>
        </div>

        <div className="text-sm font-semibold flex items-center gap-2 mt-5 cursor-pointer hover:underline">
          {buttonText}
          <Icon icon="heroicons:arrow-long-right" className="w-5 h-5" />
        </div>
      </div>

      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent size="lg" className="p-0 border-none">
          <Button
            size="icon"
            onClick={() => setOpenVideo(false)}
            className="absolute -top-4 -right-4 bg-red-600 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/YOUR_SUSTHIO_VIDEO_ID"
            title="SusthiO Demo"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddBlock;
