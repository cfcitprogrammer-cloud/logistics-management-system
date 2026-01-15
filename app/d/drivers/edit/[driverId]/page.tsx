"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { driverSchema } from "@/db/schema/driver";
import { Driver } from "@/db/types/driver";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";

export default function EditDriverPage() {
  const { driverId } = useParams();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof driverSchema>) {
    setLoading(true);

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify({
          action: "driver",
          path: "update-driver",
          ...form,
        })
      );

      console.log(res.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function getDriver() {
    setLoading(true);

    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        params: {
          action: "driver",
          path: "get-driver",
          id: driverId,
        },
      });

      const driver = res.data?.data;

      form.setValue("name", driver.NAME || "");
      form.setValue("email", driver.EMAIL || "");
      form.setValue("phone", driver.PHONE || "");
    } catch (error) {
      // set error
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log(driverId);
    getDriver();
  }, []);

  return (
    <section>
      <header className="mb-2">
        <h1 className="font-semibold text-xl">Edit Driver Information</h1>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent>
              <h1 className="font-semibold mb-2">Driver Information</h1>
              <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="John Doe"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="john@example.com"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Phone */}
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        {...field}
                        type="tel"
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="+1234567890"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Update Driver"}
              </Button>
            </CardFooter>
          </Card>

          {/* Optional right-side panel for extra driver info or logs */}
          <div className="col-span-2">
            {/* You can add a component here similar to ItemDataList */}
          </div>
        </div>
      </form>
    </section>
  );
}
