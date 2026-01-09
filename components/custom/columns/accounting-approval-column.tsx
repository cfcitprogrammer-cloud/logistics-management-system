import { ColumnDef } from "@tanstack/react-table";
import { PO } from "@/db/types/po";
import Link from "next/link";

export const accountingApprovalColumns: ColumnDef<PO>[] = [
  {
    accessorKey: "poNumber",
    header: "PO Number",
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
  },
  {
    accessorKey: "recipientName",
    header: "Recipient",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
  },
  {
    accessorKey: "file",
    header: "File",
    cell: ({ row }) =>
      row.original.FILE ? (
        <Link href={row.original.FILE || "#"} target="_blank">
          View
        </Link>
      ) : (
        "-"
      ),
  },
];
