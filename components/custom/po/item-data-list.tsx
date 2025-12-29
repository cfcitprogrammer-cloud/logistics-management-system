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
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form";
import { purchaseOrderSchema } from "@/db/schema/purchase-order";
import * as z from "zod";
import { useState } from "react";

type FormData = z.infer<typeof purchaseOrderSchema>;

export default function ItemDataList({
  form,
}: {
  form: UseFormReturn<FormData>;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "itemData",
  });

  function editItem(index: number) {
    const item = fields[index];
    setEditingIndex(index);

    // Populate the form with the item values to allow editing
    form.setValue("currentItem", {
      materialNumber: item.materialNumber,
      itemDescription: item.itemDescription,
      quantity: item.quantity,
      unitOfMeasure: item.unitOfMeasure,
      unitPrice: item.unitPrice,
    });
  }

  function deleteItem(index: number) {
    remove(index);
  }

  function addItem() {
    append({
      materialNumber: form.getValues("currentItem.materialNumber"),
      itemDescription: form.getValues("currentItem.itemDescription"),
      quantity: form.getValues("currentItem.quantity"),
      unitOfMeasure: form.getValues("currentItem.unitOfMeasure"),
      unitPrice: form.getValues("currentItem.unitPrice"),
    });

    clearCurrentItem();
  }

  function saveEdit() {
    if (editingIndex !== null) {
      const updatedItem = form.getValues("currentItem");

      update(editingIndex, updatedItem);
      setEditingIndex(null);
      clearCurrentItem();
    }
  }

  function clearCurrentItem() {
    form.setValue("currentItem", {
      materialNumber: "",
      itemDescription: "",
      quantity: 0,
      unitOfMeasure: "",
      unitPrice: 0,
    });
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

        <Button
          type="button"
          className="w-full"
          onClick={editingIndex !== null ? saveEdit : addItem}
        >
          {editingIndex !== null ? "Save Item" : "Add Item"}
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
            {fields.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {item.materialNumber}
                </TableCell>
                <TableCell>{item.itemDescription}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitOfMeasure}</TableCell>
                <TableCell className="text-right">{item.unitPrice}</TableCell>
                <TableCell>
                  <Button
                    size={"sm"}
                    type="button"
                    onClick={() => editItem(index)}
                  >
                    Edit
                  </Button>{" "}
                  |{" "}
                  <Button
                    size={"sm"}
                    type="button"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
