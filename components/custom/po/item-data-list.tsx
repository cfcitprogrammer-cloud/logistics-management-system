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
  const [materialNumber, setMaterialNumber] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "itemData",
  });

  function saveItem() {
    if (editingIndex !== null) {
      update(editingIndex, {
        materialNumber: materialNumber,
        itemDescription: itemDescription,
        quantity: quantity,
        unitOfMeasure: unitOfMeasure,
        unitPrice: unitPrice,
      });
      setEditingIndex(null);
    }
    clearCurrentItem();
  }

  function editItem(index: number) {
    const item = fields[index];
    setEditingIndex(index);
    setMaterialNumber(item.materialNumber || "");
    setItemDescription(item.itemDescription || "");
    setQuantity(item.quantity || 0);
    setUnitOfMeasure(item.unitOfMeasure || "");
    setUnitPrice(item.unitPrice || 0);
  }

  function deleteItem(index: number) {
    remove(index);
  }

  function addItem() {
    append({
      materialNumber: materialNumber,
      itemDescription: itemDescription,
      quantity: quantity,
      unitOfMeasure: unitOfMeasure,
      unitPrice: unitPrice,
    });

    clearCurrentItem();
  }

  function clearCurrentItem() {
    setMaterialNumber("");
    setItemDescription("");
    setQuantity(0);
    setUnitOfMeasure("");
    setUnitPrice(0);
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <Field className="col-span-full">
          <FieldLabel htmlFor="materialNumber">Material Number</FieldLabel>
          <Input
            id="materialNumber"
            autoComplete="off"
            placeholder="John Doe"
            className="bg-slate-100"
            value={materialNumber}
            onChange={(e) => setMaterialNumber(e.target.value)}
          />
        </Field>

        <Field className="col-span-full">
          <FieldLabel htmlFor="itemDescription">Item Description</FieldLabel>
          <Input
            id="itemDescription"
            autoComplete="off"
            placeholder="John Doe"
            className="bg-slate-100"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-3 gap-2">
          <Field>
            <FieldLabel htmlFor="qty">Qty</FieldLabel>
            <Input
              id="qty"
              autoComplete="off"
              placeholder="John Doe"
              className="bg-slate-100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="uom">Unit of Measure</FieldLabel>
            <Input
              id="uom"
              autoComplete="off"
              placeholder="John Doe"
              className="bg-slate-100"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="unitPrice">Unit Price</FieldLabel>
            <Input
              id="unitPrice"
              autoComplete="off"
              placeholder="John Doe"
              className="bg-slate-100"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </Field>
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={editingIndex !== null ? saveItem : addItem}
        >
          {editingIndex !== null ? "Update Item" : "Add Item"}
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
