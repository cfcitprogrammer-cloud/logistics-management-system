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
  supplierName: z.string().nonempty("Supplier Name is required"),
  recipientName: z.string().nonempty("Recipient Name is required"),
  deliveryDate: z.string().nonempty("Delivery Date is required"),
  deliveryAddress: z.string().nonempty("Delivery Address is required"),
  itemData: z
    .array(itemDataSchema.optional())
    .min(1, "At least one item is required"),
  remarks: z.string().max(500, "Limit Reached").optional(),
});
