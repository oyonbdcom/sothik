/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Check, Copy, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DefaultPasswordAlert() {
  const { user }: any = useAuth();
  const [copied, setCopied] = useState(false);
  const defaultPass = "Password@123";

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultPass);
    setCopied(true);
    toast.success("পাসওয়ার্ড কপি হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user?.isDefaultPassword) return null;

  return (
    <div className="mb-6">
      <Alert className="bg-amber-50 border-amber-200 rounded-[1.5rem] p-5 shadow-sm border-2 overflow-hidden relative">
        {/* ব্যাকগ্রাউন্ড অ্যানিমেশন ইফেক্ট */}
        <div className="absolute top-0 right-0 p-1 bg-amber-200/30 rounded-bl-2xl text-[10px] font-bold text-amber-600 uppercase tracking-tighter">
          Security Alert
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 animate-bounce">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
          </div>

          <div className="flex-1 space-y-1">
            <AlertTitle className="text-amber-800 font-black text-lg tracking-tight">
              পাসওয়ার্ড পরিবর্তন করুন!
            </AlertTitle>
            <AlertDescription className="text-amber-700 text-sm font-medium leading-relaxed">
              নিরাপত্তার জন্য আপনার ডিফল্ট পাসওয়ার্ডটি পরিবর্তন করা জরুরি।
              <br className="hidden sm:block" />
              আপনার বর্তমান ডিফল্ট পাসওয়ার্ড:
              <button
                onClick={handleCopy}
                className="ml-2 inline-flex items-center gap-1.5 bg-white border border-amber-200 px-2 py-0.5 rounded-lg text-amber-800 font-mono font-bold hover:bg-amber-100 transition-all active:scale-95"
              >
                {defaultPass}
                {copied ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </AlertDescription>
          </div>

          <div className="w-full md:w-auto pt-2 md:pt-0">
            <Link
              href={`/${user?.role.toLowerCase()}/change-password`}
              className="flex items-center justify-center gap-2 text-sm font-black bg-amber-600 text-white px-6 py-3 rounded-2xl hover:bg-amber-700 transition-all shadow-md shadow-amber-200 w-full md:w-fit group"
            >
              পরিবর্তন করুন
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </Alert>
    </div>
  );
}
