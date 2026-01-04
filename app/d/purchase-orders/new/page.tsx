"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { purchaseOrderSchema } from "@/db/schema/purchase-order";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ItemDataList from "@/components/custom/po/item-data-list";
import { useEffect } from "react";
import { filetobase64 } from "@/lib/file-converter";

export default function NewPurchaseOrderPage() {
  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: "",
      issueDate: "",
      supplierName: "",
      recipientName: "",
      deliveryDate: "",
      deliveryAddress: "",
      itemData: [],
      remarks: "",
      file: null, // will store { name, type, content } object
    },
  });

  async function onSubmit(data: z.infer<typeof purchaseOrderSchema>) {
    try {
      console.log("Form data ready for submission:", data);

      // Example: sending to Google Apps Script endpoint
      const res = await fetch(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "purchase-order",
          path: "create-po",
          ...data,
        }),
      });

      const result = await res.json();
      console.log("Upload result:", result);
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  }

  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  return (
    <section>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent>
              <h1 className="font-semibold">Main Information</h1>
              <div className="grid grid-cols-2 gap-4">
                {/* PO Number */}
                <Controller
                  name="poNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>PO Number</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="PO12345"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Issue Date */}
                <Controller
                  name="issueDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Issue Date</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="date"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Supplier Name */}
                <Controller
                  name="supplierName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Supplier Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="Supplier ABC"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Recipient Name */}
                <Controller
                  name="recipientName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Recipient Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="John Doe"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* PO Attachment */}
                <Controller
                  name="file"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        PO Attachment
                      </FieldLabel>
                      <Input
                        type="file"
                        accept=".doc, .docx, .pdf"
                        id={field.name}
                        className="bg-slate-100"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            // Convert to Base64 (raw, without prefix)
                            const base64 = await filetobase64(file);

                            // Save file object to form state
                            field.onChange({
                              name: file.name,
                              type: file.type,
                              content: base64,
                            });
                          } catch (err) {
                            console.error("File reading failed:", err);
                          }
                        }}
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
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Remarks (optional)
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="Any notes..."
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <h1 className="font-semibold">Shipping Information</h1>

                {/* Delivery Address */}
                <Controller
                  name="deliveryAddress"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Delivery Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        placeholder="123 Street, City"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Delivery Date */}
                <Controller
                  name="deliveryDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="col-span-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        Delivery Date
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="date"
                        aria-invalid={fieldState.invalid}
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
                Create Purchase Order
              </Button>
            </CardFooter>
          </Card>

          {/* Item List */}
          <div className="col-span-2">
            <ItemDataList form={form} />
          </div>
        </div>
      </form>
    </section>
  );
}
