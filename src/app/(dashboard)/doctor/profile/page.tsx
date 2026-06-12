/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DoctorDialog from "@/components/doctor/doctor-dialog";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { RatingField } from "@/components/ui/rating";
import { useGetDoctorByIdQuery } from "@/redux/api/doctorApi";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import OverviewTab from "./components/overview-tab";
import ReviewsTab from "./components/reviews-tab";

export default function DoctorProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    // { id: "schedule", label: "Schedule" },
    { id: "reviews", label: "Reviews" },
  ];

  // api
  const { data, isLoading } = useGetDoctorByIdQuery(undefined);
  const doctor = data?.doctor;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  // ২. ডাটা না থাকলে এরর বা খালি স্টেট হ্যান্ডেল করুন (অপশনাল কিন্তু জরুরি)
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">ডাক্তারের তথ্য পাওয়া যায়নি।</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 space-y-4">
        {/* ── Hero Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
          <div className="p-6">
            <div className="flex gap-4 items-start">
              <Avatar name={doctor?.user?.name} image={doctor?.user?.image} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="default" color="secondary">
                    🫀 {doctor?.department?.name}
                  </Badge>
                  {doctor?.isEmergency && (
                    <Badge color="destructive">⚡ Emergency</Badge>
                  )}
                </div>
                <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                  {doctor?.user?.name}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {doctor?.position}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingField
                    readOnly
                    value={doctor?.averageRating || 0}
                    size={12}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {doctor?.averageRating || 0}
                  </span>
                  <span className="text-xs text-gray-400">
                    · {doctor?.reviewsCount} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { val: `${doctor?.experience || 0}+`, label: "Years Exp." },
                { val: doctor?.totalAppointments || 0, label: "Appointments" },
                { val: doctor?.totalPatients || 0, label: "Patients" },
                { val: doctor?.averageRating || 0, label: "Avg Rating" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                >
                  <p className="text-xl font-semibold text-gray-900">
                    {s?.val}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{s?.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-2 mt-4">
              <Link
                href={doctor?.website || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition-colors"
              >
                🌐 Website
              </Link>
              <DoctorDialog doctor={doctor} isEditMode />
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
          {tabs.map((t) => (
            <TabButton
              key={t?.id}
              active={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </TabButton>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && <OverviewTab doctor={doctor} />}

        {/* ── Reviews Tab ── */}
        {activeTab === "reviews" && <ReviewsTab doctor={doctor} />}
      </div>
    </div>
  );
}

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({ name, image, size = "lg" }: AvatarProps) => {
  const sizes = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
  };

  if (image)
    return (
      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-blue-100`}
      />
    );
  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 ring-2 ring-blue-200`}
    >
      {name}
    </div>
  );
};

function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
