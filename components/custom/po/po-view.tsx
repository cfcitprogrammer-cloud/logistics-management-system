"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PO } from "@/db/types/po";
import { POItem } from "@/db/types/po-item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type POWithItems = PO & { items: POItem[] };

interface POViewProps {
  currentPO: PO | null;
}

export default function POView({ currentPO }: POViewProps) {
  const [sidePO, setSidePO] = useState<POWithItems | null>(null);
  const [loading, setLoading] = useState(false);

  /** Fetch PO details when currentPO changes */
  useEffect(() => {
    if (!currentPO) {
      setSidePO(null);
      return;
    }

    async function fetchPODetails(id: number) {
      setLoading(true);
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

        setSidePO(response.data?.data || null);
      } catch (error) {
        console.error("Error fetching PO details:", error);
        setSidePO(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPODetails(currentPO.ID);
  }, [currentPO]);

  if (!currentPO) return null;

  return (
    <aside className="w-1/3 p-4 rounded-xl bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">PO Details</h2>

      {loading ? (
        <p>Loading...</p>
      ) : sidePO ? (
        <div className="text-sm grid grid-cols-2 gap-2">
          <p>
            <strong>PO Number:</strong> <br />
            {sidePO["PO NUMBER"]}
          </p>
          <p>
            <strong>Issue Date:</strong> <br />
            {new Date(sidePO["ISSUE DATE"]).toLocaleDateString()}
          </p>
          <p>
            <strong>Supplier:</strong> <br /> {sidePO["SUPPLIER NAME"]}
          </p>
          <p>
            <strong>Recipient:</strong> <br /> {sidePO["RECIPIENT NAME"]}
          </p>
          <p>
            <strong>Delivery Address:</strong> <br />{" "}
            {sidePO["DELIVERY ADDRESS"]}
          </p>
          <p>
            <strong>Remarks:</strong> <br /> {sidePO["REMARKS"]}
          </p>
          <p>
            <strong>Created At:</strong> <br />
            {new Date(sidePO["CREATED AT"]).toLocaleString()}
          </p>
          <p>
            <strong>Accounting Approval:</strong> <br />
            {sidePO["ACCOUNTING APPROVAL"] || "Pending"}
          </p>
          <p>
            <strong>Warehouse Approval:</strong> <br />
            {sidePO["WAREHOUSE APPROVAL"] || "Pending"}
          </p>
          <p>
            <strong>File:</strong> <br />
            {sidePO["FILE"] && (
              <a
                href={sidePO["FILE"]}
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
                {sidePO.items?.map((item, index) => (
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
                    {sidePO.items
                      ?.reduce(
                        (sum, item) => sum + item.QTY * item["UNIT PRICE"],
                        0
                      )
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Select a PO to see details</p>
      )}
    </aside>
  );
}
