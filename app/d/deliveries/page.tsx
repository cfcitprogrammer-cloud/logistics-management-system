"use client";

import { useEffect, useState } from "react";
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
import { Ellipsis, Info, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewDeliveriesDialog from "@/components/custom/dialogs/new-deliveries-dialog";
import DeliveryViewCard from "@/components/custom/deliveries/delivery-view";
import PODialog from "@/components/custom/dialogs/po-dialog";

export default function DeliveriesPage() {
  const [key, setKey] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null,
  );

  // 👉 NEW STATE
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [isPoOpen, setPoOpen] = useState(false);
  const [prepPO, setPrepPO] = useState<PO | null>(null);

  const handlePrepForDelivery = (po: PO) => {
    setPrepPO(po);
    setIsNewDeliveryOpen(true);
  };

  const handleViewDetails = (po: PO) => {
    setPrepPO(po);
    setPoOpen(true);
  };

  useEffect(() => {
    console.log(selectedDelivery);
  }, [selectedDelivery]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <header className="col-span-full border-0 border-l-4 pl-2 border-l-primary">
        <h1 className="text-sm font-semibold">Deliveries</h1>
        <p className="text-sm">
          Track, manage, and monitor all your shipments in real time
        </p>
      </header>

      {/* Ready for Delivery */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Ready for Delivery</CardTitle>
          <CardDescription>
            Updated as of{" "}
            {new Date().toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
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
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleViewDetails(row)}>
                    <Info />
                    View Details
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handlePrepForDelivery(row)}>
                    <Package />
                    Prep for Delivery
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>

      {/* All Deliveries */}
      <Card className={selectedDelivery ? "md:col-span-2" : "md:col-span-full"}>
        <CardHeader>
          <CardTitle>All Deliveries</CardTitle>
          <CardDescription>
            Updated as of{" "}
            {new Date().toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </CardDescription>

          <CardAction>
            <div className="bg-primary text-primary-foreground rounded-xl p-2">
              <Truck />
            </div>
          </CardAction>
        </CardHeader>

        <CardContent>
          <DeliveryTable
            key={key}
            columns={warehouseColumns}
            onSelect={setSelectedDelivery}
          />
        </CardContent>
      </Card>

      {/* Delivery Details */}
      {selectedDelivery && (
        <DeliveryViewCard selectedDelivery={selectedDelivery} setKey={setKey} />
      )}

      {/* ✅ Dialog shown ONLY when prep is clicked */}
      <NewDeliveriesDialog
        open={isNewDeliveryOpen}
        onOpenChange={setIsNewDeliveryOpen}
        po={prepPO}
        setKey={setKey}
      />

      <PODialog currentPO={prepPO} open={isPoOpen} onOpenChange={setPoOpen} />
    </section>
  );
}
