"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fleetSchema } from "@/db/schema/fleet";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function NewFleetPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof fleetSchema>>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      plateNumber: "",
      model: "",
      loadCapacity: "",
      remarks: "",
    },
  });

  async function onSubmit(data: z.infer<typeof fleetSchema>) {
    setLoading(true);

    try {
      console.log("Fleet data ready for submission:", data);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify({
          action: "fleet",
          path: "create-fleet",
          ...data,
        })
      );

      console.log("Fleet created:", res);
      alert("Fleet created.");
    } catch (err) {
      console.error("Fleet submission failed:", err);
      alert("Something went wrong. Fleet not created");
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <section>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent>
              <h1 className="font-semibold">Fleet Information</h1>
              <div className="grid grid-cols-1 gap-4">
                {/* Plate Number */}
                <Controller
                  name="plateNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Plate Number</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="ABC-1234"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Model */}
                <Controller
                  name="model"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Model</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Truck X"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Load Capacity */}
                <Controller
                  name="loadCapacity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Load Capacity
                      </FieldLabel>
                      <Input
                        {...field}
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="1000 kg"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Remarks */}
                <Controller
                  name="remarks"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Remarks (optional)
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Any notes..."
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
              <Button type="submit" className="w-full">
                {loading ? <Spinner /> : "Add Fleet"}
              </Button>
            </CardFooter>
          </Card>

          {/* Optional right-side panel */}
          <div className="col-span-2">
            {/* Can add extra fleet info, history, or tables */}
          </div>
        </div>
      </form>
    </section>
  );
}
