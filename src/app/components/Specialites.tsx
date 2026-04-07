"use client";

import { doctorDepartments } from "@/constant/common";
import Link from "next/link";

const Specialties = () => {
  return (
    <section className="container py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            বিশেষজ্ঞতা <span className="text-blue-700">অনুযায়ী</span> খুঁজুন
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            আপনার সমস্যা অনুযায়ী সঠিক বিশেষজ্ঞ বেছে নিন
          </p>
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          সব দেখুন →
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {doctorDepartments.slice(0, 16).map((s) => (
          <Link
            href={`/doctors?department=${s.value}`}
            key={s.label}
            className="card-hover bg-white border border-slate-100 rounded-2xl p-4 text-center group hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-xs font-bold text-slate-700 group-hover:text-blue-700">
              {s.label}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {s?.count || 0} জন
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Specialties;
