"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Mail, MessageCircle, Phone } from "lucide-react";

const ContactPage = () => {
  const channels = [
    {
      label: "Support",
      title: "Chat on WhatsApp",
      info: "+880 1737813575",
      link: "https://wa.me/8801737813575",
      icon: <MessageCircle size={20} />,
    },
    {
      label: "Business",
      title: "Email our Team",
      info: "hello@susthio.com",
      link: "mailto:hello@susthio.com",
      icon: <Mail size={20} />,
    },
    {
      label: "Emergency",
      title: "Direct Call",
      info: "+880 1XXXXXXXXX",
      link: "tel:+8801XXXXXXXXX",
      icon: <Phone size={20} />,
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <div className="container mx-auto px-6 py-24 lg:py-40">
        {/* Top Header */}
        <div className="border-b border-slate-100 pb-12 mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-8xl font-medium tracking-tighter mb-8"
          >
            Get in touch.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl lg:text-2xl text-slate-500 max-w-2xl leading-relaxed"
          >
            আপনার ক্লিনিক বা স্বাস্থ্যসেবা ডিজিটাল করতে আমাদের সাথে সরাসরি যুক্ত
            হোন। আমরা ২৪ ঘণ্টার মধ্যে ফিডব্যাক প্রদান করি।
          </motion.p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-100 border border-slate-100 overflow-hidden rounded-3xl">
          {channels.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              target="_blank"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-12 lg:p-16 flex flex-col justify-between hover:bg-slate-50 transition-colors duration-500 min-h-[320px]"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-900 text-white rounded-full transition-transform duration-500 group-hover:rotate-[360deg]">
                  {item.icon}
                </div>
                <ArrowUpRight
                  className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                  size={32}
                />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                  {item.label}
                </span>
                <h3 className="text-3xl font-medium mb-2">{item.title}</h3>
                <p className="text-lg text-slate-500">{item.info}</p>
              </div>
            </motion.a>
          ))}

          {/* Location Block */}
          <div className="bg-slate-900 p-12 lg:p-16 text-white flex flex-col justify-between min-h-[320px]">
            <Globe className="text-blue-500" size={32} />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                Location
              </span>
              <h3 className="text-3xl font-medium mb-2 text-white">
                Dinajpur, Bangladesh
              </h3>
              <p className="text-lg text-slate-400">রংপুর বিভাগ, বাংলাদেশ</p>
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        {/* <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-8 text-sm font-medium text-slate-400 uppercase tracking-widest">
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Twitter
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContactPage;
