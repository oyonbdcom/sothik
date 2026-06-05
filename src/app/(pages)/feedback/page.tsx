import FeedbackPageClient from "./client";
export const metadata = {
  title: "আপনার মতামত জানান",
  description:
    "Sasthik প্ল্যাটফর্ম সম্পর্কে আপনার যেকোনো অভিযোগ, পরামর্শ বা মূল্যবান মতামত আমাদের জানান। আপনাদের ফিডব্যাক আমাদের আরও উন্নত স্বাস্থ্যসেবা প্রদানে সাহায্য করবে।",
  keywords: ["Sasthik feedback", "সাস্থিক মতামত", "অভিযোগ ও পরামর্শ"],
};
export default function page() {
  return <FeedbackPageClient />;
}
