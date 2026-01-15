"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  async function forgotPassword() {
    setLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");

    try {
      await sendPasswordResetEmail(auth, email);

      setFeedbackMsg(
        "Reset link sent to your email. Please check spam if not found"
      );
    } catch (error) {
      setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email address</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter your email address"
          />

          <p className="text-red-500">{errorMsg}</p>
          <p className="text-green-500">{feedbackMsg}</p>

          <Button
            className="w-full"
            disabled={loading}
            onClick={forgotPassword}
          >
            {loading ? <Spinner /> : "Submit Email"}
          </Button>
          <Link href={"/a/login"}>
            <Button className="w-full" variant={"outline"}>
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
