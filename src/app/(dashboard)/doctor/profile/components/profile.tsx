/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DoctorDialog from "@/components/doctor/doctor-dialog";
import { Badge } from "@/components/ui/badge";
import { RatingField } from "@/components/ui/rating";
import Link from "next/link";
import { useState } from "react";

const doctor = {
  id: "doc_1",
  slug: "dr-ahmed-hasan",
  specialization: "Cardiologist",
  department: { name: "Cardiology" },
  position: "Senior Consultant Cardiologist",
  hospital: "Square Hospital, Dhaka",
  website: "https://dr-ahmedhasan.com",
  experience: 12,
  gender: "MALE",
  isEmergency: true,
  averageRating: 4.9,
  reviewsCount: 120,
  user: {
    name: "Dr. Ahmed Hasan",
    email: "ahmed@hospital.com",
    image: null,
  },
  practices: [
    {
      area: "Dinajpur",
      centers: ["Setabganj Diagnostic Center", "Dinajpur Medical Center"],
    },
    {
      area: "Rangpur",
      centers: ["Rangpur Lab & Diagnostic"],
    },
  ],
  education: [
    { degree: "MBBS", institution: "Dhaka Medical College", year: "2010" },
    { degree: "FCPS (Cardiology)", institution: "BCPS", year: "2015" },
    {
      degree: "MD (Cardiology)",
      institution: "National Heart Foundation",
      year: "2018",
    },
  ],
  schedule: [
    { day: "Sat", slots: ["10:00 AM", "11:00 AM", "4:00 PM"] },
    { day: "Sun", slots: ["10:00 AM", "12:00 PM"] },
    { day: "Tue", slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"] },
    { day: "Thu", slots: ["10:00 AM", "4:00 PM"] },
  ],
  reviews: [
    {
      id: 1,
      name: "Rahim Uddin",
      rating: 5,
      date: "May 2025",
      comment:
        "Excellent doctor. Very thorough and explained everything clearly. Highly recommended.",
    },
    {
      id: 2,
      name: "Fatema Begum",
      rating: 5,
      date: "Apr 2025",
      comment:
        "Very professional and caring. The diagnosis was spot on and the treatment worked perfectly.",
    },
    {
      id: 3,
      name: "Kamal Hossain",
      rating: 4,
      date: "Mar 2025",
      comment:
        "Great experience overall. Wait time was a bit long but the consultation was worth it.",
    },
  ],
};

interface AvatarProps {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({ name, image, size = "lg" }: AvatarProps) => {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  const sizes = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
  };

  if (image)
    return (
      <img
        src={image}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-blue-100`}
      />
    );
  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 ring-2 ring-blue-200`}
    >
      {initials}
    </div>
  );
};

function SectionCard({ title, icon, children }: any) {
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

export default function DoctorProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    // { id: "schedule", label: "Schedule" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 space-y-4">
        {/* ── Hero Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
          <div className="p-6">
            <div className="flex gap-4 items-start">
              <Avatar name={doctor.user.name} image={doctor.user.image} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="default" color="secondary">
                    🫀 {doctor.department.name}
                  </Badge>
                  {doctor.isEmergency && (
                    <Badge color="destructive">⚡ Emergency</Badge>
                  )}
                </div>
                <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                  {doctor.user.name}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {doctor.position}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingField
                    readOnly
                    value={doctor.averageRating}
                    size={12}
                  />
                  <span className="text-sm font-semibold text-gray-800">
                    {doctor.averageRating}
                  </span>
                  <span className="text-xs text-gray-400">
                    · {doctor.reviewsCount} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { val: `${doctor.experience}+`, label: "Years Exp." },
                { val: doctor.averageRating, label: "Avg Rating" },
                { val: doctor.reviewsCount, label: "Reviews" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                >
                  <p className="text-xl font-semibold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-2 mt-4">
              <Link
                href={"/doctor/dashboard"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                📅 View Appointment
              </Link>
              <a
                href={doctor.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition-colors"
              >
                🌐 Website
              </a>
              <DoctorDialog />
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
          {tabs.map((t) => (
            <TabButton
              key={t.id}
              active={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </TabButton>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <SectionCard title="Contact & Details" icon="🏥">
              <div className="space-y-3">
                {[
                  { icon: "🏥", label: "Hospital", val: doctor.hospital },
                  {
                    icon: "💊",
                    label: "Specialization",
                    val: doctor.specialization,
                  },
                  { icon: "🪪", label: "Position", val: doctor.position },
                  {
                    icon: "✉️",
                    label: "Email",
                    val: doctor.user.email,
                    email: true,
                  },
                  {
                    icon: "👤",
                    label: "Gender",
                    val: doctor.gender === "MALE" ? "Male" : "Female",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span className="text-base mt-0.5">{row.icon}</span>
                    <span className="text-gray-400 w-28 flex-shrink-0">
                      {row.label}
                    </span>
                    <span
                      className={`font-medium ${
                        row.email ? "text-blue-600" : "text-gray-800"
                      }`}
                    >
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Education" icon="🎓">
              <div className="relative">
                <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gray-100" />
                <div className="space-y-0">
                  {doctor.education.map((edu, i) => (
                    <div key={i} className="flex gap-4 py-3">
                      <div className="flex flex-col items-center z-10">
                        <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                      </div>
                      <div className="flex-1 pb-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {edu.degree}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {edu.institution}
                        </p>
                        <span className="inline-block mt-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {edu.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Practice Areas" icon="📍">
              <div className="space-y-4">
                {doctor.practices.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">📌</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {p.area}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-5">
                      {p.centers.map((c) => (
                        <span
                          key={c}
                          className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <SectionCard title={null} icon={""}>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">
                    {doctor.averageRating}
                  </p>
                  <RatingField readOnly value={doctor.averageRating} />
                  <p className="text-xs text-gray-400 mt-1">
                    {doctor.reviewsCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = doctor.reviews.filter(
                      (r) => r.rating === star,
                    ).length;
                    const pct =
                      Math.round((count / doctor.reviews.length) * 100) || 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="text-gray-400 w-3">{star}</span>
                        <span className="text-amber-400 text-xs">★</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-6 text-right">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            {doctor.reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={r.name} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        {r.name}
                      </p>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <RatingField
                      readOnly
                      value={doctor.averageRating}
                      size={10}
                    />
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
