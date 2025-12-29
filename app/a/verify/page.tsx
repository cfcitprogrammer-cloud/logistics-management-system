"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(15); // countdown from 45

  useEffect(() => {
    // Countdown interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    // Redirect after 45 seconds
    const timeout = setTimeout(() => {
      router.replace("/a/login");
    }, 15000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardContent className="text-center">
        <h1 className="text-xl font-semibold mb-2">Pending Approval</h1>
        <p className="mb-4">
          Your account is created and pending approval. You will be redirected
          to login in <span className="font-bold">{secondsLeft}</span> seconds.
        </p>
        <p>Please wait or refresh the page if necessary.</p>
      </CardContent>
    </Card>
  );
}
