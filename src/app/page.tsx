import LandingPageView from "@/components/landing-page";
import LayoutLoader from "@/components/layout-loader";

import { Suspense } from "react";
const page = "";
export default function Page() {
  return (
    // 1. Wrap the component that uses useSearchParams in Suspense
    <Suspense fallback={<LayoutLoader />}>
      <LandingPageView />;
    </Suspense>
  );
}
