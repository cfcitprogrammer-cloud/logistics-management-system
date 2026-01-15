"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/firebase";
import { fi } from "date-fns/locale";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }

      const user = await signInWithEmailAndPassword(auth, email, password);

      if (user) {
        router.replace("/d/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("No user found with that email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else {
        setError("An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="h-screen flex justify-center items-center p-4">
      <Card className="w-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Log in to continue managing your logistics operations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-red-500 mb-2">{error}</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                className="bg-slate-100"
                id="email"
                autoComplete="off"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                className="bg-slate-100"
                id="password"
                type="password"
                autoComplete="off"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col md:flex-row md:items-center">
                <Input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-6"
                />
                <Label className="text-xs text-gray-500" htmlFor="remember-me">
                  Remember Me
                </Label>
              </div>

              <Link
                className="text-primary text-xs"
                href={"/a/forgot-password"}
              >
                Forgot Password
              </Link>
            </div>

            <Button className="w-full">
              {loading ? <Spinner /> : "Login"}
            </Button>

            <p className="text-xs text-center">
              Don't have an account?{" "}
              <Link href={"/a/register"} className="text-primary">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
