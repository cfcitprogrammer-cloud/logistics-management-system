"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";

import { columns } from "@/components/custom/columns/po-column";
import { POTable } from "@/components/custom/tables/PO-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { POItem } from "@/db/types/po-item";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

type POWithItems = PO & {
  items: POItem[];
};

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<PO[]>([]);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [sidePO, setSidePO] = useState<POWithItems | null>(null);
  const [sidePOLoading, setSidePOLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function setStatus(dept: string, status: string, id: number) {
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const response = await axios.post(
        url,
        JSON.stringify({
          status,
          id,
          action: "purchase-order",
          path: dept,
        })
      );

      setSidePO(response.data?.data || []);
      console.log(response);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      setSidePO(null);
    } finally {
    }
  }

  function onSelect(po: PO) {
    if (po) {
      console.log("PO:", po);
      console.log(po.ID);
      setSelectedPO(po);
      getSidePO(po.ID);
    } else {
      setSelectedPO(null);
    }
  }

  async function getSidePO(id: number) {
    setSidePOLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const response = await axios.post(
        url,
        JSON.stringify({
          action: "purchase-order",
          path: "get-po",
          id,
        })
      );

      setSidePO(response.data?.data || []);
      console.log(response);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      setSidePO(null);
    } finally {
      setSidePOLoading(false);
    }
  }

  async function getAllPO(page = 1, limit = 10) {
    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const response = await axios.get(url, {
        params: {
          action: "purchase-order",
          path: "get-all-po",
          page,
          limit,
        },
      });

      setData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllPO();
  }, []);

  return (
    <section>
      <div className="flex gap-4">
        {/* TABLE */}
        <div
          className={`${
            selectedPO ? "w-2/3" : "w-full"
          } p-4 rounded-xl bg-white shadow-sm`}
        >
          <header className="flex justify-between items-center gap-4 mb-4">
            <h1 className="text-sm font-semibold">Purchase Orders</h1>

            <div className="flex gap-4">
              <Input placeholder="Search..." />
              <Link href="purchase-orders/new">
                <Button>New PO</Button>
              </Link>
            </div>
          </header>

          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <POTable
              data={data}
              columns={columns}
              onSelect={(row) => onSelect(row!)}
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
                          onClick={() => {
                            setStatus("accounting", "APPROVED", row.ID);
                          }}
                          disabled={!!row["ACCOUNTING APPROVAL"]}
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setStatus("accounting", "PENDING", row.ID);
                          }}
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setStatus("accounting", "REJECTED", row.ID);
                          }}
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
                          onClick={() => {
                            setStatus("warehouse", "APPROVED", row.ID);
                          }}
                          disabled={!!row["WAREHOUSE APPROVAL"]}
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setStatus("warehouse", "PENDING", row.ID);
                          }}
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setStatus("warehouse", "REJECTED", row.ID);
                          }}
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => {
                      console.log("Delete PO", row);
                    }}
                  >
                    View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => {
                      console.log("Delete PO", row);
                    }}
                  >
                    Proceed to shipment
                  </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
          )}
        </div>

        {/* PO DETAILS */}
        {selectedPO != null && (
          <aside className="w-1/3 p-4 rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-2">PO Details</h2>

            {selectedPO ? (
              <div className=" text-sm grid grid-cols-2 gap-2">
                <p>
                  <strong>PO Number:</strong> <br />
                  {selectedPO["PO NUMBER"]}
                </p>
                <p>
                  <strong>Issue Date:</strong> <br />
                  {new Date(selectedPO["ISSUE DATE"]).toLocaleDateString()}
                </p>
                <p>
                  <strong>Supplier:</strong> <br />{" "}
                  {selectedPO["SUPPLIER NAME"]}
                </p>
                <p>
                  <strong>Recipient:</strong> <br />
                  {selectedPO["RECIPIENT NAME"]}
                </p>
                <p>
                  <strong>Delivery Address:</strong> <br />
                  {selectedPO["DELIVERY ADDRESS"]}
                </p>
                <p>
                  <strong>Remarks:</strong> <br /> {selectedPO["REMARKS"]}
                </p>
                <p>
                  <strong>Created At:</strong> <br />
                  {new Date(selectedPO["CREATED AT"]).toLocaleString()}
                </p>
                <p>
                  <strong>Accounting Approval:</strong> <br />
                  {selectedPO["ACCOUNTING APPROVAL"] || "Pending"}
                </p>
                <p>
                  <strong>Warehouse Approval:</strong> <br />
                  {selectedPO["WAREHOUSE APPROVAL"] || "Pending"}
                </p>
                <p>
                  <strong>File:</strong> <br />
                  {selectedPO["FILE"] && (
                    <a
                      href={selectedPO["FILE"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  )}
                </p>

                <div className="col-span-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>UOM</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sidePO?.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item["ITEM DESCRIPTION"]}
                          </TableCell>
                          <TableCell>{item.QTY}</TableCell>
                          <TableCell>{item.UOM}</TableCell>
                          <TableCell className="text-right">
                            ₱ {(item["UNIT PRICE"] * item.QTY).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* TOTAL ROW */}
                      <TableRow className="font-semibold border-t">
                        <TableCell colSpan={3} className="text-right">
                          Total
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{" "}
                          {sidePO?.items
                            ?.reduce(
                              (sum, item) =>
                                sum + item.QTY * item["UNIT PRICE"],
                              0
                            )
                            .toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Button className="col-span-full">View Details</Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a PO to see details
              </p>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
