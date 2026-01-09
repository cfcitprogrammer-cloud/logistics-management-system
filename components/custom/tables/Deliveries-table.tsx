"use client";

import { useEffect, useState } from "react";
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
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delivery } from "@/db/types/delivery";
import axios from "axios";

interface DeliveryTableProps {
  columns: ColumnDef<Delivery, any>[];
  renderActions?: (row: Delivery) => React.ReactNode;
  onSelect?: (row: Delivery | null) => void;
  pageSize?: number;
}

export default function DeliveryTable({
  columns,
  renderActions,
  onSelect,
  pageSize = 10,
}: DeliveryTableProps) {
  const [data, setData] = useState<Delivery[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState(""); // typed
  const [searchTerm, setSearchTerm] = useState(""); // applied

  const actionColumn: ColumnDef<Delivery> | null = renderActions
    ? {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {renderActions(row.original)}
          </div>
        ),
      }
    : null;

  const table = useReactTable({
    data,
    columns: actionColumn ? [...columns, actionColumn] : columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
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
    getRowId: (row) => row.ID?.toString() ?? "",
  });

  async function fetchDeliveries(page = 1, limit = 10, search = "") {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
      const response = await axios.get(url, {
        params: {
          action: "delivery",
          path: "list",
          page,
          limit,
          search,
        },
      });

      setData(response.data?.data || []);
      const total = response.data?.totalPages || 1;
      setMaxPage(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setData([]);
      setMaxPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeliveries(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    if (searchInput === "") {
      setCurrentPage(1);
      setSearchTerm("");
    }
  }, [searchInput]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Search input */}
      <div className="p-2 flex gap-2">
        <Input
          placeholder="Search PO ID or Tracking ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

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
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actionColumn ? 1 : 0)}
                className="h-24 text-center"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                data-state={rowSelection[row.id] ? "selected" : undefined}
                onClick={() => {
                  const isSelected = rowSelection[row.id];
                  const newSelection = isSelected ? {} : { [row.id]: true };
                  setRowSelection(newSelection);
                  if (onSelect) onSelect(isSelected ? null : row.original);
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
                No deliveries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="p-2 flex justify-between items-center">
        <div>
          Page {currentPage} of {maxPage}
        </div>
        <ButtonGroup>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, maxPage))}
            disabled={currentPage === maxPage}
          >
            Next
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
