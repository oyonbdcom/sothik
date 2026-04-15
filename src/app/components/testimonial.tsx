export default function Testimonial() {
  const testimonials = [
    {
      name: "রকিবুল হাসান",
      location: "ঢাকা",
      text: "মাত্র ৫ মিনিটে অ্যাপয়েন্টমেন্ট নিয়েছিলাম। কোনো লাইন ছাড়াই ডাক্তার দেখাতে পেরেছি। অসাধারণ সেবা!",
      rating: 5,
      initials: "রক",
      bg: "bg-blue-100 text-blue-700",
    },
    {
      name: "নাসরিন আক্তার",
      location: "চট্টগ্রাম",
      text: "আমার মায়ের জন্য কাছের সেন্টারে নিউরোলজিস্ট খুঁজছিলাম। এই ওয়েবসাইটের মাধ্যমে সহজেই পেয়ে গেলাম।",
      rating: 5,
      initials: "না",
      bg: "bg-emerald-100 text-emerald-700",
    },
    {
      name: "কামরুজ্জামান",
      location: "সিলেট",
      text: "ফিল্টার সিস্টেমটা দারুণ। বিশেষজ্ঞতা ও এলাকা দিয়ে একসাথে খোঁজা যায়। শিশুর ডাক্তার খুঁজতে কষ্ট হয়নি।",
      rating: 5,
      initials: "কা",
      bg: "bg-rose-100 text-rose-700",
    },
  ];
  return (
    <section className="container py-16 px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900">
          রোগীদের <span className="text-blue-700">অভিজ্ঞতা</span>
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          আমাদের সেবা সম্পর্কে তারা কী বলছেন
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="card-hover bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          >
            {/* Quote mark */}
            <div className="text-4xl text-blue-100 font-serif leading-none mb-3">
              &quot;
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic mb-5">
              {t.text}
            </p>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-3.5 h-3.5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${t.bg}`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{t.name}</p>
                <p className="text-xs text-blue-400">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
