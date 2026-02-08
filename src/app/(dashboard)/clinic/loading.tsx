import SiteLogo from "@/components/sitelogo";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center flex-col space-y-2">
      <SiteLogo />
      <div className="inline-flex gap-1">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </div>
    </div>
  );
}
