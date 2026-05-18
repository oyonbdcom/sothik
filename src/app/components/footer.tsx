"use client";

import SiteLogo from "@/components/sitelogo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* BRAND */}
          <div>
            <SiteLogo />
            <p className="text-sm leading-relaxed mt-3">
              বাংলাদেশের রোগী ও ডাক্তারদের মধ্যে সেতু তৈরি করে সেরা
              স্বাস্থ্যসেবা নিশ্চিত করছি।
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">সেবাসমূহ</h4>

            <Link
              href="/doctors"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              ডাক্তার খুঁজুন
            </Link>

            <Link
              href="/diagnostic-centers"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              ডায়াগনস্টিক সেন্টার
            </Link>

            <Link
              href="/appointments"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              অনলাইন বুকিং
            </Link>

            <Link
              href="/health-tips"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              স্বাস্থ্য পরামর্শ
            </Link>
          </div>

          {/* INFO */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">তথ্য</h4>

            <Link
              href="/about"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              আমাদের সম্পর্কে
            </Link>

            <Link
              href="/how-it-works"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              কীভাবে কাজ করে
            </Link>

            <Link
              href="/blog"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              ব্লগ
            </Link>

            <Link
              href="/careers"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              ক্যারিয়ার
            </Link>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">যোগাযোগ</h4>

            <Link
              href="/support"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              সাপোর্ট
            </Link>

            <Link
              href="/feedback"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              ফিডব্যাক
            </Link>

            <Link
              href="/privacy-policy"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              গোপনীয়তা নীতি
            </Link>

            <Link
              href="/terms"
              className="block text-sm mb-2.5 hover:text-blue-400"
            >
              শর্তাবলী
            </Link>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© ২০২৫ ডাক্তারবাড়ি · সর্বস্বত্ব সংরক্ষিত</p>
          <p className="text-blue-400 font-medium">
            Made with ❤️ for Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
