"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { warehouseColumns } from "@/components/custom/columns/warehouse-column";
import WarehouseTable from "@/components/custom/tables/Warehouse-table";
import { WarehouseStock } from "@/db/types/warehouse";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

export default function WarehousePage() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<WarehouseStock | null>(null);

  return (
    <Card>
      {/* Header */}
      <CardHeader>
        <CardTitle>Warehouse Stock Management</CardTitle>
        <CardDescription>
          Updated as of{" "}
          {new Date().toLocaleString("en-US", {
            month: "long", // Full month name
            day: "numeric", // Day of the month
            year: "numeric", // Full year
            hour: "numeric", // Hour
            minute: "2-digit", // Minutes
            hour12: true, // 12-hour format with AM/PM
          })}{" "}
        </CardDescription>

        {/* Action toolbar */}
        <CardAction className="flex gap-2">
          {/* NEW Stock */}
          <Button onClick={() => router.push("/d/warehouse/new")}>
            New Stock
          </Button>

          {/* Adjust Stock for selected row */}
          <Button
            disabled={!selectedItem}
            onClick={() => router.push(`/warehouse/adjust/${selectedItem?.ID}`)}
          >
            Adjust Stock
          </Button>
        </CardAction>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <WarehouseTable
          columns={warehouseColumns}
          onSelect={setSelectedItem}
          renderActions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/d/warehouse/edit/${row["ITEM ID"]}`)
                  }
                >
                  Update Stock
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </CardContent>
    </Card>
  );
}
