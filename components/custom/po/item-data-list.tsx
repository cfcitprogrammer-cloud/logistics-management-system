import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Controller, UseFormReturn } from "react-hook-form";
import { purchaseOrderSchema } from "@/db/schema/purchase-order";
import * as z from "zod";

type FormData = z.infer<typeof purchaseOrderSchema>;

export default function ItemDataList({
  form,
}: {
  form: UseFormReturn<FormData>;
}) {
  function editItem() {
    form.setValue("currentItem.materialNumber", "Edited Material Number");
  }

  function deleteItem() {}

  function addItem() {
    form.setValue("currentItem.materialNumber", "New Material Number");
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <Controller
          name="currentItem.materialNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Material Number</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="John Doe"
                className="bg-slate-100"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="currentItem.itemDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Item Description</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="John Doe"
                className="bg-slate-100"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Controller
              name="currentItem.quantity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-full"
                >
                  <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
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

          <div>
            <Controller
              name="currentItem.unitOfMeasure"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="col-span-full"
                >
                  <FieldLabel htmlFor={field.name}>Unit of Measure</FieldLabel>
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
        </div>

        <Controller
          name="currentItem.unitPrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor={field.name}>Unit Price</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder="John Doe"
                className="bg-slate-100"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="button" className="w-full">
          Add Item
        </Button>

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Material Number</TableHead>
              <TableHead>Item Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead> UOM</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>1</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell>
                <Button size={"sm"}>Edit</Button> |{" "}
                <Button size={"sm"}>Delete</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
