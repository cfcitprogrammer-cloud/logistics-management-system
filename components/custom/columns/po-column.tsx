"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PO } from "@/db/types/po";

const safeText = (value: unknown) => {
  if (typeof value !== "string") return "-";
  return value.trim() !== "" ? value : "-";
};

const safeDate = (value?: string | null, withTime = false) => {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? "-"
    : withTime
    ? d.toLocaleString()
    : d.toLocaleDateString();
};

export const columns: ColumnDef<PO>[] = [
  {
    accessorKey: "PO NUMBER",
    header: "PO Number",
    cell: (info) => safeText(info.getValue<string>()),
  },
  {
    accessorKey: "ISSUE DATE",
    header: "Issue Date",
    cell: (info) => safeDate(info.getValue<string>()),
  },
  {
    accessorKey: "SUPPLIER NAME",
    header: "Supplier Name",
    cell: (info) => safeText(info.getValue<string>()),
  },
  {
    accessorKey: "RECIPIENT NAME",
    header: "Recipient Name",
    cell: (info) => safeText(info.getValue<string>()),
  },
  {
    accessorKey: "FILE",
    header: "File",
    cell: (info) => {
      const file = info.getValue<string | null>();
      if (!file) return "-";

      return (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View
        </a>
      );
    },
  },
  {
    accessorKey: "CREATED AT",
    header: "Created At",
    cell: (info) => safeDate(info.getValue<string>(), true),
  },
  {
    accessorKey: "ACCOUNTING APPROVAL",
    header: "Accounting Approval",
    cell: (info) => safeText(info.getValue<string>()),
  },
  {
    accessorKey: "WAREHOUSE APPROVAL",
    header: "Warehouse Approval",
    cell: (info) => safeText(info.getValue<string>()),
  },
];
