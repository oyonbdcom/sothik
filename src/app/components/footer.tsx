"use client";

import SiteLogo from "@/components/sitelogo";
import { siteConfig } from "@/config/site";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* BRAND SECTION */}
          <div className="space-y-5">
            <SiteLogo />
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              ডিজিটাল সিরিয়াল ম্যানেজমেন্ট এবং স্মার্ট ডায়াগনস্টিক সেবার
              মাধ্যমে স্বাস্থ্যসেবা গ্রহণকে সহজ ও আধুনিক করাই আমাদের লক্ষ্য।
            </p>
            <div className="flex items-center gap-2 text-emerald-600 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 w-fit px-3 py-1 rounded-full">
              <ShieldCheck size={14} />
              <span>Data Privacy Guaranteed</span>
            </div>
          </div>

          {/* SYSTEM MODULES */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">
              সিস্টেম ফিচারসমূহ
            </h4>
            <ul className="space-y-3">
              {[
                { name: "স্পেশালিস্ট ডাক্তার", href: "/doctors" },
                { name: "লাইভ সিরিয়াল ট্র্যাকিং", href: "#" },
                { name: "ক্লিনিক ম্যানেজমেন্ট", href: "#" },
                { name: "পেশেন্ট ড্যাশবোর্ড", href: "#" },
                {
                  name: "ডিজিটাল প্রেসক্রিপশন ও রিপোর্ট",
                  href: "/#",
                },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL & SUPPORT */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">
              সহায়তা ও নীতিমালা
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-blue-600 transition-colors"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  ব্যবহারের শর্তাবলী
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  কাস্টমার সাপোর্ট
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-6">
              যোগাযোগ
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 shrink-0" />
                <span className="text-slate-500">দিনাজপুর সদর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-600 shrink-0" />
                <a
                  href="mailto:info@Sasthik.com"
                  className="hover:text-blue-600 transition-colors"
                >
                  info@Sasthik.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-600 shrink-0" />
                <span className="text-slate-500">০১৭০০-০০০০০০</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© ২০২৬</span>
            <span className="font-bold text-slate-900 uppercase tracking-tighter">
              {siteConfig.siteName}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="italic">স্মার্ট হেলথকেয়ার সিস্টেম</span>
          </div>
          <div className="flex gap-6 text-slate-400">
            <Link href="#" className="hover:text-blue-600">
              Facebook
            </Link>
            <Link href="#" className="hover:text-blue-600">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
