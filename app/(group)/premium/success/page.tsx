"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PremiumSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch("/api/stripe/verify-payment", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">🎉 Premium Activated!</h1>
    </div>
  );
}
