import Footer from "@/app/components/footer";
import Header from "@/app/components/header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
