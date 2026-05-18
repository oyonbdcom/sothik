"use client";

import { useCreateFeedbackMutation } from "@/redux/api/reviewApi";
import { motion } from "framer-motion";
import { MessageSquare, Send, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const TestimonialForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  // UI only (not saved in DB)
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [comment, setComment] = useState("");

  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!rating || !comment) {
      alert("রেটিং এবং মন্তব্য আবশ্যক");
      return;
    }

    try {
      await createFeedback({
        rating,
        comment,
      }).unwrap();

      // reset form
      setRating(0);
      setHover(0);
      setName("");
      setLocation("");
      setComment("");

      toast.success("ধন্যবাদ! আপনার ফিডব্যাক সফলভাবে জমা হয়েছে 🎉");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "কিছু সমস্যা হয়েছে!");
      } else {
        toast.error("কিছু সমস্যা হয়েছে!");
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-[2.5rem] p-8 md:p-16 border border-slate-100 shadow-sm">
          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              আপনার অভিজ্ঞতা শেয়ার করুন
            </h2>
            <p className="text-slate-500">
              আপনার মতামত অন্য রোগীদের সিদ্ধান্ত নিতে সাহায্য করবে।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ⭐ RATING */}
            <div className="flex flex-col items-center space-y-4 pb-8 border-b border-slate-200">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                রেটিং দিন
              </p>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      size={40}
                      className={`${
                        (hover || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* COMMENT */}
            <div>
              <label className="text-sm font-bold">আপনার মন্তব্য</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-slate-400" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full pl-12 py-4 border rounded-2xl"
                  rows={4}
                  placeholder="আপনার অভিজ্ঞতা লিখুন..."
                />
              </div>
            </div>

            {/* SUBMIT */}
            <motion.button
              disabled={isLoading}
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl flex justify-center items-center gap-2"
            >
              {isLoading ? "সাবমিট হচ্ছে..." : "ফিডব্যাক সাবমিট করুন"}
              <Send size={18} />
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialForm;
