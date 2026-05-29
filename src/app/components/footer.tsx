"use client";

import SiteLogo from "@/components/sitelogo";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* BRAND SECTION - ভিশন ও পরিচিতি */}
          <div className="space-y-4">
            <SiteLogo />
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              ডায়াগনস্টিক সেন্টারের অফলাইন সিরিয়াল ম্যানেজমেন্টকে ডিজিটাল করে
              রোগী ও ডাক্তারদের অভিজ্ঞতাকে সহজতর করাই আমাদের লক্ষ্য।
            </p>
            <div className="flex items-center gap-2 text-[#06B6D4] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Data Privacy Secured</span>
            </div>
          </div>

          {/* SYSTEM MODULES - সিস্টেমের মূল ফিচারসমূহ */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-5">
              সিস্টেম মডিউল
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/doctors"
                  className="text-sm hover:text-[#1A237E] transition-colors"
                >
                  ডাক্তার বুকিং
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-[#1A237E] transition-colors"
                >
                  সিরিয়াল ম্যানেজমেন্ট
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-[#1A237E] transition-colors"
                >
                  সেন্টার পোর্টাল
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-[#1A237E] transition-colors"
                >
                  কোঅর্ডিনেটর ড্যাশবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL & SUPPORT - আইনি ও সহায়তা */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-5">
              আইনগত ও সহায়তা
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#1A237E] transition-colors"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#1A237E] transition-colors"
                >
                  শর্তাবলী (Terms & Conditions)
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#1A237E] transition-colors"
                >
                  সাপোর্ট সেন্টার
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT - যোগাযোগ (দিনাজপুর ফোকাস) */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-5">
              যোগাযোগ
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#06B6D4] shrink-0" />
                <span>দিনাজপুর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#06B6D4] shrink-0" />
                <a
                  href="mailto:support@sasthik.com"
                  className="hover:text-[#1A237E]"
                >
                  support@sasthik.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#06B6D4] shrink-0" />
                <span>+৮৮০ ১৭XX-XXXXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-slate-200 pt-8 flex  justify-center items-center gap-4 text-[13px]">
          <div className="flex items-center  gap-2 text-slate-500">
            <span>© ২০২৬</span>
            <span className="font-bold text-[#1A237E]">Sasthik</span>
            <span className="hidden sm:inline">•</span>
            <span className="italic">স্মার্ট হেলথকেয়ার সলিউশন।</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
