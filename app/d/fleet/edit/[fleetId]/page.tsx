"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { fleetSchema } from "@/db/schema/fleet";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as z from "zod";

export default function EditFleet() {
  const { fleetId } = useParams();
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

  async function getFleet() {
    setLoading(true);

    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        params: {
          action: "fleet",
          path: "get-fleet",
          id: fleetId,
        },
      });

      const fleet = res?.data?.data;

      console.log(fleet);

      form.setValue("model", fleet.MODEL || "");
      form.setValue("loadCapacity", fleet["LOAD CAPACITY"] || "");
      form.setValue("plateNumber", fleet["PLATE NUMBER"] || "");
      form.setValue("remarks", fleet["REMARKS"] || "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: z.infer<typeof fleetSchema>) {
    setLoading(true);

    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        action: "fleet",
        path: "update-fleet",
        ...form,
      });

      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFleet();
  }, []);

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
              <Button type="submit" className="w-full" disabled={loading}>
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
