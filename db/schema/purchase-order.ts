import * as z from "zod";

export const itemDataSchema = z.object({
  materialNumber: z.string().nonempty("Material Number is required").optional(),
  itemDescription: z
    .string()
    .nonempty("Item Description is required")
    .optional(),
  quantity: z.number().min(1, "Quantity must be at least 1").optional(),
  unitOfMeasure: z.string().nonempty("Unit of Measure is required").optional(),
  unitPrice: z.number().min(0, "Unit Price cannot be negative").optional(),
});

export const purchaseOrderSchema = z.object({
  poNumber: z
    .string()
    .nonempty("PO Number is required")
    .max(100, "Limit Reached"),
  issueDate: z.string().nonempty("Issue Date is required"),
  supplierName: z.string().optional(),
  recipientName: z.string().optional(),
  deliveryDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  itemData: z.array(itemDataSchema.optional()).optional(),
  remarks: z.string().max(500, "Limit Reached").optional(),
  file: z.any().optional(),
});
