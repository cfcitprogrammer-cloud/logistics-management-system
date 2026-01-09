import { ColumnDef } from "@tanstack/react-table";
import { Delivery } from "@/db/types/delivery";

export const warehouseColumns: ColumnDef<Delivery>[] = [
  {
    accessorKey: "PO ID",
    header: "PO ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "LAST LOCATION",
    header: "Last Location",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "DELIVERY ADDRESS",
    header: "Delivery Address",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "STATUS",
    header: "Status",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "DELIVERY DATE",
    header: "Delivery Date",
    cell: (info) =>
      new Date(info.getValue() as number).toLocaleDateString("en-US"),
  },
  {
    accessorKey: "TRACKING ID",
    header: "Tracking ID",
    cell: (info) => info.getValue() ?? "-",
  },
  {
    accessorKey: "CREATED AT",
    header: "Created At",
    cell: (info) =>
      info.getValue()
        ? new Date(info.getValue() as string).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "-",
  },
];
