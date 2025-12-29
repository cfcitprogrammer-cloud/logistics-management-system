"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { purchaseOrderSchema } from "@/db/schema/purchase-order";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ItemDataList from "@/components/custom/po/item-data-list";

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
      file: "",
    },
  });

  function onSubmit(data: z.infer<typeof purchaseOrderSchema>) {
    // Do something with the form values.
    console.log(data);
  }

  return (
    <section>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardContent>
              <h1 className="font-semibold">Main Information</h1>

              <div className="grid grid-cols-2 gap-4">
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
                        placeholder="John Doe"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                        placeholder="John Doe"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                        {...field}
                        type="file"
                        accept=".doc, .docx, .pdf"
                        id={field.name}
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

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
                        placeholder="John Doe"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <h1 className="font-semibold">Shipping Information</h1>

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
                        placeholder="John Doe"
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

          <div className="col-span-2">
            <ItemDataList form={form} />
          </div>
        </div>
      </form>
    </section>
  );
}
