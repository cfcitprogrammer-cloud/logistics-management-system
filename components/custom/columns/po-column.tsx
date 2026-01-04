"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PO } from "@/db/types/po";

export const columns: ColumnDef<PO>[] = [
  //   { accessorKey: "ID", header: "ID",  },
  { accessorKey: "PO NUMBER", header: "PO Number" },
  {
    accessorKey: "ISSUE DATE",
    header: "Issue Date",
    cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
  },
  { accessorKey: "SUPPLIER NAME", header: "Supplier Name" },
  { accessorKey: "RECIPIENT NAME", header: "Recipient Name" },
  {
    accessorKey: "FILE",
    header: "File",
    cell: (info) => (
      <a
        href={info.getValue<string>()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View
      </a>
    ),
  },
  //   { accessorKey: "REMARKS", header: "Remarks" },
  //   { accessorKey: "DELIVERY ADDRESS", header: "Delivery Address" },
  {
    accessorKey: "CREATED AT",
    header: "Created At",
    cell: (info) => new Date(info.getValue<string>()).toLocaleString(),
  },
  { accessorKey: "ACCOUNTING APPROVAL", header: "Accounting Approval" },
  { accessorKey: "WAREHOUSE APPROVAL", header: "Warehouse Approval" },
];
