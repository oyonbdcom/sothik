"use client"; // Error components must be Client Components

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function Error({ error }: { error?: string }) {
  const reset = () => {
    window.location.reload();
  };
  return (
    <div className="space-y-4">
      <Alert color="destructive" variant="soft">
        <Info className="h-5 w-5" />
        <AlertDescription>{`Something went wrong!`}</AlertDescription>
      </Alert>
      <Button onClick={() => reset()} color="destructive" size="sm">
        Try again
      </Button>
    </div>
  );
}
