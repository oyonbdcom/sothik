"use client";
import DefaultPasswordAlert from "@/components/default-password-alart";
import { registerNotification } from "@/lib/registernotification";
import { BellRing } from "lucide-react";
import { useState } from "react";
import ClientComponent from "./appointments/ClientComponent";

export default function AppointmentPage() {
  // টেস্ট করার জন্য isExpired: true করে দিচ্ছি
  const [subscription] = useState({
    isExpired: false,
    expiryDate: "২০২৪-০৫-২০",
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* সাবস্ক্রিপশন এক্সপায়ার নোটিফিকেশন কার্ড */}
        <DefaultPasswordAlert />

        {/* মেইন ড্যাশবোর্ড হেডার */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              ড্যাশবোর্ড
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              আপনার অ্যাপয়েন্টমেন্টের বর্তমান অবস্থা
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => registerNotification()}
              className="group flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300"
            >
              {/* Bell Icon Animation Fix: Adding class via group-hover */}
              <BellRing size={18} className="group-hover:animate-ring" />
              নোটিফিকেশন
            </button>
          </div>
        </div>

        {/* লিস্ট সেকশন */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-1">
            <ClientComponent />
          </div>
        </div>
      </div>

      {/* কাস্টম CSS অ্যানিমেশন */}
      <style jsx global>{`
        /* নোটিফিকেশন স্লাইড ডাউন অ্যানিমেশন */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out forwards;
        }

        /* ঘণ্টার (Bell) রিং অ্যানিমেশন */
        @keyframes ring {
          0%,
          100% {
            transform: rotate(0);
          }
          20% {
            transform: rotate(15deg);
          }
          40% {
            transform: rotate(-10deg);
          }
          60% {
            transform: rotate(5deg);
          }
          80% {
            transform: rotate(-5deg);
          }
        }
        .animate-ring {
          animation: ring 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
