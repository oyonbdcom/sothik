"use client";

import { siteConfig } from "@/config/site";
import { motion } from "framer-motion";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

const ContactClient = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const contactMethods = [
    {
      title: "সরাসরি কথা বলুন",
      info: siteConfig.contact?.phone,
      description:
        "যেকোনো জরুরি জিজ্ঞাসা বা সিরিয়াল সংক্রান্ত সহায়তার জন্য কল করুন।",
      icon: <Phone className="text-blue-600" size={24} />,
      link: `tel:${siteConfig.contact.phone}`,
      bg: "bg-blue-50",
    },
    {
      title: "হোয়াটসঅ্যাপ সাপোর্ট",
      info: "লাইভ চ্যাট এভেলেবল",
      description: "দ্রুত ফিডব্যাকের জন্য আমাদের হোয়াটসঅ্যাপে মেসেজ দিন।",
      icon: <MessageCircle className="text-emerald-600" size={24} />,
      link: `https://wa.me/${siteConfig.contact?.phone}`,
      bg: "bg-emerald-50",
    },
    {
      title: "অফিশিয়াল ইমেইল",
      info: "hello@Sasthik.com",
      description: "পার্টনারশিপ বা বিজনেস প্রপোজালের জন্য আমাদের মেইল করুন।",
      icon: <Mail className="text-purple-600" size={24} />,
      link: `mailto:${siteConfig.contact?.email}`,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header Section */}
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              <ShieldCheck size={14} /> Your Health, Our Priority
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tighter mb-6">
              আমরা আছি আপনার <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                পাশে সবসময়।
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              সাস্থিক (Sasthik) টিম আপনার সেবায় নিয়োজিত। ডায়াগনস্টিক সেন্টার বা
              ডাক্তার সংক্রান্ত যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactMethods.map((method, i) => (
                <motion.a
                  key={i}
                  href={method.link}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group block p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500"
                >
                  <div
                    className={`w-14 h-14 ${method.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-lg font-semibold text-slate-700 mb-2">
                    {method.info}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {method.description}
                  </p>
                </motion.a>
              ))}

              {/* Office Location Info */}
              <div className="p-8 rounded-[2rem] bg-slate-900 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 rounded-xl text-blue-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">হেড অফিস</h4>
                    <p className="text-sm text-slate-400">
                      দিনাজপুর সদর, বাংলাদেশ
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl text-emerald-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">সাপোর্ট টাইম</h4>
                    <p className="text-sm text-slate-400">
                      সকাল ১০টা - রাত ১০টা
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Modern Contact Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-slate-50 rounded-[3rem] p-8 lg:p-16 border border-slate-100"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
                সরাসরি মেসেজ পাঠান
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    আপনার নাম
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: আব্দুল্লাহ আল মামুন"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    placeholder="০১৭XXXXXXXX"
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    মেসেজ (আপনার সমস্যার বিবরণ)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="আপনার প্রশ্ন বা মতামত এখানে লিখুন..."
                    className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700 resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="group w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                    মেসেজ পাঠান{" "}
                    <Send
                      size={20}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Quote Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
            Integrity & Care
          </p>
          <h3 className="text-2xl lg:text-3xl font-medium text-slate-700 italic">
            &quot;তথ্য দিয়ে হয়রানি নয়, সঠিক তথ্যে জীবন বাঁচাই।&quot;
          </h3>
        </div>
      </section>
    </div>
  );
};

export default ContactClient;
