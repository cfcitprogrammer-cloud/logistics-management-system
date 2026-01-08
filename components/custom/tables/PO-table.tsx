"use client";

import { useState } from "react";
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSelect?: (row: TData | null) => void;
  renderActions?: (row: TData) => React.ReactNode;
}

export function POTable<TData, TValue>({
  columns,
  data,
  onSelect,
  renderActions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const actionColumn: ColumnDef<TData> | null = renderActions
    ? {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div
            className="flex gap-2"
            onClick={(e) => e.stopPropagation()} // prevent row selection
          >
            {renderActions(row.original)}
          </div>
        ),
      }
    : null;

  const table = useReactTable({
    data,
    columns: actionColumn ? [...columns, actionColumn] : columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: (newSelection) => {
      const lastSelectedId = Object.keys(newSelection).pop();
      const singleSelection = lastSelectedId ? { [lastSelectedId]: true } : {};

      setRowSelection(singleSelection);

      if (onSelect) {
        const selectedRow = lastSelectedId
          ? table.getRow(lastSelectedId)?.original
          : null;
        onSelect(selectedRow ?? null);
      }
    },
    getRowId: (row) => (row as any).ID?.toString() ?? "",
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
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                data-state={rowSelection[row.id] ? "selected" : undefined}
                onClick={() => {
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
              <TableCell
                colSpan={columns.length + (actionColumn ? 1 : 0)}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="p-2 flex justify-between items-center">
        <div>
          <p>Showing 1 of 20</p>
        </div>

        <div>
          <ButtonGroup>
            <Button>Prev</Button>
            <Button>Next</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}
