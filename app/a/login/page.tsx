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
import { auth } from "@/lib/firebase";
import { fi } from "date-fns/locale";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
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
        console.log("User logged in:", user);
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
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
          <form className="space-y-4" onSubmit={onSubmit}>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                className="bg-slate-100"
                id="email"
                autoComplete="off"
                placeholder="m@example.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                className="bg-slate-100"
                id="password"
                autoComplete="off"
                placeholder="******"
              />
            </Field>

            <div className="flex justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label className="text-xs text-gray-500" htmlFor="remember-me">
                  Remember Me
                </Label>
              </div>

              <Link className="text-primary text-xs" href={"#"}>
                Forgot Password
              </Link>
            </div>

            <Button className="w-full">Login</Button>

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
