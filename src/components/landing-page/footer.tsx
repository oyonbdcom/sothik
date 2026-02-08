"use client";
import { siteConfig, socials } from "@/config/site";
import { Icon } from "@iconify/react";
import {
  Activity,
  ArrowRight,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SiteLogo from "../sitelogo";

const Footer = () => {
  return (
    <footer className="relative bg-[#020617] text-slate-300 pt-20 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
          {/* 1. Brand Section */}
          <div className="space-y-6">
            <div className="brightness-200 contrast-125">
              <SiteLogo />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              আপনার বিশ্বস্ত স্বাস্থ্যসেবা পার্টনার। আমরা অত্যাধুনিক প্রযুক্তির
              মাধ্যমে মেডিকেল সার্ভিসকে আরও সহজ ও উন্নত করতে প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="flex items-center gap-3">
              {socials.map((item, index) => (
                <Link
                  href={item.href}
                  key={`social-${index}`}
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 group transition-all duration-300"
                >
                  <Image
                    src={item.icon}
                    alt="social"
                    width={18}
                    height={18}
                    className="opacity-60 group-hover:opacity-100 group-hover:brightness-200 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> কুইক লিংকস
            </h4>
            <ul className="space-y-3">
              {[
                { name: "ডাক্তার খুঁজুন", href: "/doctors" },
                { name: "ক্লিনিক খুজুন", href: "/clinics" },
                { name: "আমাদের সম্পর্কে", href: "/about-us" },
                { name: "যোগাযোগ", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    <span className="relative overflow-hidden">
                      {link.name}
                      {/* Hover Underline Effect */}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base">যোগাযোগ</h4>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-sm">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    ঠিকানা
                  </p>
                  <p className="text-slate-400 mt-0.5">{siteConfig.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-sm">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    ফোন
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    {siteConfig?.contact?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Support & Trust */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-base">সাপোর্ট</h4>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800">
              <p className="text-xs text-slate-400 mb-4">
                যেকোনো জিজ্ঞাসা বা সাহায্যের জন্য আমাদের ইমেইল করুন:
              </p>
              <Link
                href={`mailto:${siteConfig?.contact?.email}`}
                className="flex items-center gap-2 text-blue-400 font-bold text-sm hover:underline"
              >
                <Mail className="w-4 h-4" /> {siteConfig?.contact?.email}
              </Link>
            </div>
            <div className="flex gap-2">
              <span className="bg-slate-900 border border-slate-800 text-[10px] font-bold px-3 py-1 rounded-md">
                SSL SECURED
              </span>
              <span className="bg-slate-900 border border-slate-800 text-[10px] font-bold px-3 py-1 rounded-md">
                24/7 SUPPORT
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="py-8 border-t border-slate-900 flex flex-col md:flex-row justify-evenly items-center gap-6">
          <div className="flex items-center gap-8">
            <Link
              href="/privacy-policy"
              className="text-xs font-bold hover:text-blue-500 flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" /> গোপনীয়তা নীতি
            </Link>
            <Link
              href="/terms-condition"
              className="text-xs font-bold hover:text-blue-500 flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5" /> শর্তাবলী
            </Link>
          </div>

          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-300">{siteConfig?.siteName}</span>.
            সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                System Operational
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-600">v2.1.0</span>
          </div>
        </div>
      </div>
      {/* Static WhatsApp Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Main Toggle Button */}
        <div className="group relative">
          {/* Ping Effect */}
          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />

          <Link
            href={`https://wa.me/${siteConfig?.contact?.phone?.replace(/\s+/g, "")}`}
            target="_blank"
            className="relative bg-emerald-500 hover:bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95 group"
          >
            {/* Ping Animation - নজর কাড়ার জন্য */}
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />

            <Icon
              icon="logos:whatsapp-icon"
              className="w-7 h-7 brightness-200 relative z-10"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
