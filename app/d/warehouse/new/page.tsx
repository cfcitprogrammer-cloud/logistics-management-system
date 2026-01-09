"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { warehouseStockSchema } from "@/db/schema/warehouse-stock";
import axios from "axios";

export default function NewWarehouseStockPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof warehouseStockSchema>>({
    resolver: zodResolver(warehouseStockSchema),
    defaultValues: {
      itemId: "",
      itemName: "",
      category: "",
      uom: "",
      currentStock: 0,
      reservedStock: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      remarks: "",
    },
  });

  async function onSubmit(data: z.infer<typeof warehouseStockSchema>) {
    setLoading(true);
    try {
      console.log("Warehouse stock payload:", data);

      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        {
          action: "warehouse",
          path: "create-stock",
          ...data,
        },
        {
          headers: { "Content-Type": "text/plain" },
        }
      );

      console.log("Response:", res.data);
      alert("Stock item created successfully");
      form.reset();
    } catch (err: any) {
      console.error("Stock creation failed:", err);

      // Axios errors may have response data
      if (err.response) {
        console.error("Server response:", err.response.data);
        alert(`Error: ${err.response.data.message || "Something went wrong."}`);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <section>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardContent className="space-y-4">
              <h1 className="font-semibold">Item Information</h1>

              {/* Item ID */}
              <Controller
                name="itemId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Item ID</FieldLabel>
                    <Input {...field} className="bg-slate-100" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Item Name */}
              <Controller
                name="itemName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Item Name</FieldLabel>
                    <Input {...field} className="bg-slate-100" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Category */}
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Input {...field} className="bg-slate-100" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* UOM */}
              <Controller
                name="uom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Unit of Measure</FieldLabel>
                    <Input
                      {...field}
                      placeholder="pcs / kg / box"
                      className="bg-slate-100"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <h1 className="font-semibold">Stock Levels</h1>

              {/* Current Stock */}
              <Controller
                name="currentStock"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Current Stock</FieldLabel>
                    <Input type="number" {...field} />
                  </Field>
                )}
              />

              {/* Reserved Stock */}
              <Controller
                name="reservedStock"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Reserved Stock</FieldLabel>
                    <Input type="number" {...field} />
                  </Field>
                )}
              />

              {/* Min / Max */}
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="minStockLevel"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Min Level</FieldLabel>
                      <Input type="number" {...field} />
                    </Field>
                  )}
                />

                <Controller
                  name="maxStockLevel"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Max Level</FieldLabel>
                      <Input type="number" {...field} />
                    </Field>
                  )}
                />
              </div>

              {/* Remarks */}
              <Controller
                name="remarks"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Remarks (optional)</FieldLabel>
                    <Textarea {...field} className="bg-slate-100" />
                  </Field>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Create Stock Item"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </section>
  );
}
