"use client";

import axios from "axios";
import { columns } from "@/components/custom/columns/po-column";
import { POTable } from "@/components/custom/tables/PO-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PO } from "@/db/types/po";

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<PO[]>([]);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null); // track selected PO

  async function getAllPO(page = 1, limit = 10) {
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

      const data = response.data?.data || [];
      setData(data);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      setData([]);
    }
  }

  useEffect(() => {
    getAllPO();
  }, []);

  return (
    <section>
      <div className="flex gap-4">
        {/* Table */}
        <div className="w-2/3 p-4 rounded-xl bg-white shadow-sm">
          <header className="flex justify-between items-center gap-4 mb-4">
            <h1 className="text-sm font-semibold">Purchase Orders</h1>

            <div className="flex gap-4">
              <Input placeholder="Search..." />
              <Link href={"purchase-orders/new"}>
                <Button>New PO</Button>
              </Link>
            </div>
          </header>

          <POTable
            data={data}
            columns={columns}
            onSelect={(row) => setSelectedPO(row)}
          />
        </div>

        {/* PO Details */}
        <aside className="w-1/3 p-4 rounded-xl bg-white shadow-sm">
          <h2 className="text-sm font-semibold mb-2">PO Details</h2>
          {selectedPO ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>PO Number:</strong> {selectedPO["PO NUMBER"]}
              </p>
              <p>
                <strong>Issue Date:</strong>{" "}
                {new Date(selectedPO["ISSUE DATE"]).toLocaleDateString()}
              </p>
              <p>
                <strong>Supplier:</strong> {selectedPO["SUPPLIER NAME"]}
              </p>
              <p>
                <strong>Recipient:</strong> {selectedPO["RECIPIENT NAME"]}
              </p>
              <p>
                <strong>Delivery Address:</strong>{" "}
                {selectedPO["DELIVERY ADDRESS"]}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedPO["REMARKS"]}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedPO["CREATED AT"]).toLocaleString()}
              </p>
              <p>
                <strong>Accounting Approval:</strong>{" "}
                {selectedPO["ACCOUNTING APPROVAL"] || "Pending"}
              </p>
              <p>
                <strong>Warehouse Approval:</strong>{" "}
                {selectedPO["WAREHOUSE APPROVAL"] || "Pending"}
              </p>
              <p>
                <strong>File:</strong>{" "}
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
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a PO to see details</p>
          )}
        </aside>
      </div>
    </section>
  );
}
