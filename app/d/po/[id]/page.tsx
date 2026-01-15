"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/use-auth";
import { toast } from "sonner";

type POWithItems = PO & { items: POItem[] };

export default function PurchaseOrderPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { role } = useAuthGuard();
  const router = useRouter();

  const [po, setPO] = useState<POWithItems | null>(null);
  const [loading, setLoading] = useState(false);

  async function setStatus(dept: string, status: string, id: number) {
    setLoading(true);
    console.log(dept);
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

      if (res.data.status) {
        toast.success(`Order ${status}`);

        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Error updating status of order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    async function fetchPODetails() {
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

        setPO(response.data?.data || null);
      } catch (error) {
        console.error("Error fetching PO details:", error);
        setPO(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPODetails();
  }, [id]);

  useEffect(() => {
    if (!role) return; // wait until role is loaded

    // Only allow these roles
    const allowedRoles = ["admin", "accounting", "warehouse"];
    if (!allowedRoles.includes(role)) {
      router.replace("/d/dashboard");
    }
  }, [role, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        Purchase order not found.
      </div>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>PO Details</CardTitle>
      </CardHeader>

      <CardContent>
        {/* PO META */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <p>
            <strong>PO Number:</strong>
            <br />
            {po["PO NUMBER"]}
          </p>
          <p>
            <strong>Issue Date:</strong>
            <br />
            {new Date(po["ISSUE DATE"]).toLocaleDateString()}
          </p>
          <p>
            <strong>Supplier:</strong>
            <br />
            {po["SUPPLIER NAME"]}
          </p>
          <p>
            <strong>Recipient:</strong>
            <br />
            {po["RECIPIENT NAME"]}
          </p>
          <p>
            <strong>Delivery Address:</strong>
            <br />
            {po["DELIVERY ADDRESS"]}
          </p>
          <p>
            <strong>Remarks:</strong>
            <br />
            {po["REMARKS"]}
          </p>
          <p>
            <strong>Created At:</strong>
            <br />
            {new Date(po["CREATED AT"]).toLocaleString()}
          </p>
          <p>
            <strong>Accounting Approval:</strong>
            <br />
            {po["ACCOUNTING APPROVAL"] || "Pending"}
          </p>
          <p>
            <strong>Warehouse Approval:</strong>
            <br />
            {po["WAREHOUSE APPROVAL"] || "Pending"}
          </p>

          {po["FILE"] && (
            <p>
              <strong>File:</strong>
              <br />
              <a
                href={po["FILE"]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Attachment
              </a>
            </p>
          )}
        </div>

        {/* ITEMS TABLE */}
        {po.items.length > 0 ? (
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
              {po.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item["ITEM DESCRIPTION"]}
                  </TableCell>
                  <TableCell>{item.QTY}</TableCell>
                  <TableCell>{item.UOM}</TableCell>
                  <TableCell className="text-right">
                    ₱ {(item.QTY * item["UNIT PRICE"]).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="font-semibold border-t">
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  ₱{" "}
                  {po.items
                    .reduce(
                      (sum, item) => sum + item.QTY * item["UNIT PRICE"],
                      0
                    )
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No items declared.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <p>Set Status</p>
        <div className="flex justify-center gap-2 w-full">
          <Button
            variant="default"
            size="sm"
            onClick={() => setStatus(role!, "APPROVED", id)}
          >
            Approve
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setStatus(role!, "REJECTED", id)}
          >
            Reject
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStatus(role!, "PENDING", id)}
          >
            Pending
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
