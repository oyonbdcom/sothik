"use client";

import SiteLogo from "@/components/sitelogo";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <SiteLogo />
            <p className="text-sm leading-relaxed">
              বাংলাদেশের রোগী ও ডাক্তারদের মধ্যে সেতু তৈরি করে সেরা
              স্বাস্থ্যসেবা নিশ্চিত করছি।
            </p>
          </div>
          {/* Links */}
          {[
            {
              title: "সেবাসমূহ",
              links: [
                "ডাক্তার খুঁজুন",
                "ডায়াগনস্টিক সেন্টার",
                "অনলাইন বুকিং",
                "স্বাস্থ্য পরামর্শ",
              ],
            },
            {
              title: "তথ্য",
              links: [
                "আমাদের সম্পর্কে",
                "কীভাবে কাজ করে",
                "ব্লগ",
                "ক্যারিয়ার",
              ],
            },
            {
              title: "যোগাযোগ",
              links: ["সাপোর্ট", "ফিডব্যাক", "গোপনীয়তা নীতি", "শর্তাবলী"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm mb-2.5 hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
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
