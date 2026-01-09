"use client";

import Link from "next/link";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import axios from "axios";

import { columns } from "@/components/custom/columns/po-column";
import POTable from "@/components/custom/tables/PO-table";
import POView from "@/components/custom/po/po-view";
import { Button } from "@/components/ui/button";
import { PO } from "@/db/types/po";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PurchaseOrdersPage() {
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);

  /** Update status for Accounting or Warehouse */
  async function setStatus(dept: string, status: string, id: number) {
    console.log({
      action: "purchase-order",
      path: dept,
      status,
      id,
    });
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
      const res = await axios.post(
        url,
        JSON.stringify({
          action: "purchase-order",
          path: dept,
          status,
          id,
        })
      );

      console.log(res);

      // Optionally, refresh the selected PO by keeping the current selection
      setSelectedPO((prev) => (prev && prev.ID === id ? { ...prev } : prev));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  return (
    <section>
      <div className="flex gap-4">
        {/* TABLE */}
        <Card
          className={`${
            selectedPO ? "w-2/3" : "w-full"
          } rounded-xl bg-white shadow-sm`}
        >
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              Updated as of{" "}
              {new Date().toLocaleString("en-US", {
                month: "long", // Full month name
                day: "numeric", // Day of the month
                year: "numeric", // Full year
                hour: "numeric", // Hour
                minute: "2-digit", // Minutes
                hour12: true, // 12-hour format with AM/PM
              })}
            </CardDescription>
            <CardAction>
              <Link href="purchase-orders/new">
                <Button>New PO</Button>
              </Link>
            </CardAction>
          </CardHeader>

          <CardContent>
            <POTable
              columns={columns}
              onSelect={setSelectedPO}
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

                  <DropdownMenuContent align="end" className="w-48">
                    {/* Accounting */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Accounting
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("accounting", "APPROVED", row.ID)
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("accounting", "PENDING", row.ID)
                          }
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("accounting", "REJECTED", row.ID)
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Warehouse */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Warehouse</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("warehouse", "APPROVED", row.ID)
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("warehouse", "PENDING", row.ID)
                          }
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setStatus("warehouse", "REJECTED", row.ID)
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          </CardContent>
        </Card>

        {/* PO DETAILS */}
        <POView currentPO={selectedPO} />
      </div>
    </section>
  );
}
