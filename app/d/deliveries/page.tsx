"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Delivery } from "@/db/types/delivery";
import DeliveryTable from "@/components/custom/tables/Deliveries-table";
import { warehouseColumns } from "@/components/custom/columns/delivery-column";
import { columns } from "@/components/custom/columns/po-column";
import ReadyDeliveryTable from "@/components/custom/tables/ReadyDelivery-table";
import { PO } from "@/db/types/po";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Info, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewDeliveriesDialog from "@/components/custom/dialogs/new-deliveries-dialog";

export default function DeliveriesPage() {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);

  return (
    <section className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>All Deliveries</CardTitle>
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
            <Link href={"/d/deliveries/new"}>
              <Button size={"sm"}>
                <Plus /> Add New Delivery
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DeliveryTable
            columns={warehouseColumns}
            onSelect={setSelectedDelivery}
            renderActions={(row) => (
              <button
                className="px-2 py-1 border rounded text-sm"
                onClick={() => alert(`View ${row["PO ID"]}`)}
              >
                View
              </button>
            )}
          />
        </CardContent>
      </Card>

      {selectedDelivery && (
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              Delivery Details - {selectedDelivery["PO ID"]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>PO ID:</strong> {selectedDelivery["PO ID"]}
            </p>
            <p>
              <strong>Last Location:</strong>{" "}
              {selectedDelivery["LAST LOCATION"]}
            </p>
            <p>
              <strong>Delivery Address:</strong>{" "}
              {selectedDelivery["DELIVERY ADDRESS"]}
            </p>
            <p>
              <strong>Status:</strong> {selectedDelivery.STATUS}
            </p>
            <p>
              <strong>Delivery Date:</strong>{" "}
              {new Date(selectedDelivery["DELIVERY DATE"]).toLocaleDateString()}
            </p>
            <p>
              <strong>Tracking ID:</strong>{" "}
              {selectedDelivery["TRACKING ID"] ?? "-"}
            </p>
            <p>
              <strong>Receipt File:</strong> {selectedDelivery["RECEIPT FILE"]}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ready for Delivery</CardTitle>
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
            <div className="bg-primary text-primary-foreground rounded-xl p-2">
              <Package />
            </div>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ReadyDeliveryTable
            columns={columns}
            renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => alert(`View ${row["PO NUMBER"]}`)}
                  >
                    <Info />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert(`Print ${row["PO NUMBER"]}`)}
                  >
                    <Package />
                    Prep for Delivery
                  </DropdownMenuItem>
                  {/* Add more actions as needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>
    </section>
  );
}
