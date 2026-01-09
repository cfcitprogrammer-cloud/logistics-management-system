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
import { PO } from "@/db/types/po";
import axios from "axios";
import { POEmpty } from "../po/empty-po";

interface ReadyDeliveryTableProps {
  columns: ColumnDef<PO, any>[];
  renderActions?: (row: PO) => React.ReactNode;
  onSelect?: (row: PO | null) => void;
  pageSize?: number;
}

export default function ReadyDeliveryTable({
  columns,
  renderActions,
  onSelect,
  pageSize = 10,
}: ReadyDeliveryTableProps) {
  const [data, setData] = useState<PO[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const actionColumn: ColumnDef<PO> | null = renderActions
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

  // Fetch only POs approved by accounting and warehouse
  async function fetchReadyPOs(page = 1, limit = 10, search = "") {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
      const response = await axios.get(url, {
        params: {
          action: "purchase-order",
          path: "get-ready-po",
          page,
          limit,
          search,
        },
      });

      setData(response.data?.data || []);
      const total = response.data?.totalPages || 1;
      setMaxPage(Math.ceil(total / limit));
    } catch (error) {
      console.error("Error fetching ready-for-delivery POs:", error);
      setData([]);
      setMaxPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReadyPOs(currentPage, pageSize, searchTerm);
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
      {/* Search */}
      <div className="p-2 flex gap-2">
        <Input
          placeholder="Search POs..."
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
                <POEmpty />
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
