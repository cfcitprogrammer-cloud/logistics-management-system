"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSelect?: (row: TData | null) => void; // callback for selected row
}

export function POTable<TData, TValue>({
  columns,
  data,
  onSelect,
}: DataTableProps<TData, TValue>) {
  // single row selection state
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {}
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: (newSelection) => {
      // keep only the last selected row
      const lastSelectedId = Object.keys(newSelection).pop();
      const singleSelection = lastSelectedId ? { [lastSelectedId]: true } : {};
      setRowSelection(singleSelection);

      // call the callback with the selected row data
      if (onSelect) {
        const selectedRow = lastSelectedId
          ? table.getRow(lastSelectedId)?.original
          : null;
        onSelect(selectedRow ?? null);
      }
    },
    getRowId: (row) => (row as any).ID?.toString() || "", // adjust if your rows have a unique ID
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={rowSelection[row.id] ? "selected" : undefined}
                className="cursor-pointer"
                onClick={() => {
                  // toggle selection
                  const isSelected = rowSelection[row.id];
                  const newSelection = isSelected ? {} : { [row.id]: true };
                  setRowSelection(newSelection);
                  onSelect?.(isSelected ? null : row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
