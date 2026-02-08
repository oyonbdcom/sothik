"use client";
import StatsCounters from "./counter";
import Footer from "./footer";
import Header from "./header";
import { HomeBanner } from "./hero";
import SpecialtiesCarousel from "./Specialites";
import Summary from "./summary";

const LandingPageView = () => {
  return (
    <div className="bg-background">
      <Header />

      <main>
        <HomeBanner />
        <SpecialtiesCarousel />
        {/* <BestDoctors /> */}
        <Summary />

        <StatsCounters />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPageView;
