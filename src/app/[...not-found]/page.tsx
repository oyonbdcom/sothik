"use client"; // Required for hooks

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 1. Create the countdown interval
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 2. Redirect when the countdown hits zero
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    // 3. Cleanup on unmount
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50 p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-9xl font-extrabold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        {/* Visual Countdown Indicator */}
        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full inline-block mb-8 font-medium">
          Redirecting to home in <span className="font-bold">{countdown}</span>{" "}
          seconds...
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-primary text-default font-semibold rounded-lg shadow-md hover:bg-primary-700 transition-all"
          >
            Go Home Now
          </Link>
        </div>
      </div>
    </main>
  );
}
