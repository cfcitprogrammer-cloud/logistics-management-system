import { ColumnDef } from "@tanstack/react-table";
import { WarehouseStock } from "@/db/types/warehouse";

export const warehouseColumns: ColumnDef<WarehouseStock>[] = [
  { accessorKey: "ITEM ID", header: "Item ID" },
  { accessorKey: "ITEM NAME", header: "Item Name" },
  { accessorKey: "CATEGORY", header: "Category" },
  { accessorKey: "UOM", header: "UOM" },
  { accessorKey: "CURRENT STOCK", header: "Current Stock" },
  { accessorKey: "RESERVED STOCK", header: "Reserved Stock" },
  { accessorKey: "AVAILABLE STOCK", header: "Available Stock" },
  { accessorKey: "MINIMUM STOCK LEVEL", header: "Min Level" },
  { accessorKey: "MAXIMUM STOCK LEVEL", header: "Max Level" },
];
