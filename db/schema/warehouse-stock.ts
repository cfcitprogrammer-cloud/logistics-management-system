// db/schema/warehouse-stock.ts
import * as z from "zod";

export const warehouseStockSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  itemName: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  uom: z.string().min(1, "UOM is required"),
  currentStock: z.number().min(0),
  reservedStock: z.number().min(0),
  minStockLevel: z.number().min(0),
  maxStockLevel: z.number().min(0),
  remarks: z.string().optional(),
});
