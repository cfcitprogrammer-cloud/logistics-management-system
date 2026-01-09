"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { warehouseStockSchema } from "@/db/schema/warehouse-stock";
import { WarehouseStock } from "@/db/types/warehouse";
import axios from "axios";

export default function UpdateWarehouseStockPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [stock, setStock] = useState<WarehouseStock | null>(null);

  const form = useForm<z.infer<typeof warehouseStockSchema>>({
    resolver: zodResolver(warehouseStockSchema),
  });

  /* ---------------- FETCH STOCK BY ID ---------------- */
  useEffect(() => {
    async function fetchStock() {
      try {
        // Using GET with URL parameters
        const res = await axios.get(process.env.NEXT_PUBLIC_GAS_LINK || "", {
          params: {
            action: "warehouse",
            path: "get-stock",
            itemId: id, // Pass itemId as a query parameter
          },
          headers: {
            "Content-Type": "application/json", // This will set the content type for the request
          },
        });

        const result = res.data; // Axios response data is in `data`

        console.log(res);
        setStock(result.data);

        // Reset the form with fetched stock data
        form.reset({
          itemId: result.data["ITEM ID"],
          itemName: result.data["ITEM NAME"],
          category: result.data["CATEGORY"],
          uom: result.data["UOM"],
          currentStock: result.data["CURRENT STOCK"],
          reservedStock: result.data["RESERVED STOCK"],
          minStockLevel: result.data["MINIMUM STOCK LEVEL"],
          maxStockLevel: result.data["MAXIMUM STOCK LEVEL"],
          remarks: result.data["REMARKS"], // Reset remarks field
        });
      } catch (err) {
        console.error("Failed to fetch stock:", err);
      } finally {
        setFetching(false);
      }
    }

    if (id) fetchStock(); // Only fetch when id is present
  }, [id, form]);

  /* ---------------- SUBMIT UPDATE ---------------- */
  async function onSubmit(data: z.infer<typeof warehouseStockSchema>) {
    setLoading(true);

    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "warehouse",
          path: "update-stock",
          id,
          ...data,
        }),
      });

      alert("Stock updated successfully");
      router.push("/warehouse");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  if (!stock) {
    return <p className="text-center text-red-500">Stock not found</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="space-y-4">
          <h1 className="font-semibold">Update Warehouse Stock</h1>

          {/* Item ID (Read-only) */}
          <Controller
            name="itemId"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Item ID</FieldLabel>
                <Input {...field} className="bg-slate-100" />
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
                <Input {...field} />
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
            render={({ field }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Input {...field} />
              </Field>
            )}
          />

          {/* UOM */}
          <Controller
            name="uom"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Unit of Measure</FieldLabel>
                <Input {...field} />
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Field>
            )}
          />

          {/* Min / Max */}
          <Controller
            name="minStockLevel"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Min Level</FieldLabel>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </Field>
            )}
          />

          {/* Remarks */}
          <Controller
            name="remarks"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Remarks</FieldLabel>
                <Textarea {...field} />
              </Field>
            )}
          />
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner /> : "Update Stock"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
