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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewWarehouseStockPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

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
      await axios.post(
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

      setTitle("Stock Item Created");
      setSubtitle(
        "The stock item has been successfully added to the warehouse inventory. You can now manage its stock levels and details from the inventory list."
      );

      setOpen(true);
      form.reset();
    } catch (err: any) {
      console.error("Stock creation failed:", err);

      setTitle("Failed to Create Stock Item");
      setSubtitle(
        err?.response?.data?.message ||
          "Something went wrong while creating the stock item. Please try again."
      );

      setOpen(true);
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
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
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="maxStockLevel"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Max Level</FieldLabel>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
