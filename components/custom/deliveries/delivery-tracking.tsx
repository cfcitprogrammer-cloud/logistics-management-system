"use client";

import { Clock, Package, Truck, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/date";
import { Delivery } from "@/db/types/delivery";

export default function TrackingTimeline({
  selectedDelivery,
}: {
  selectedDelivery: Delivery;
}) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Tracking History</h2>
      <Separator className="mb-4" />

      <div className="flex flex-col relative ml-4">
        {/* Vertical line */}
        <div className="absolute left-1 top-2 bottom-0 w-0.5 bg-gray-300"></div>

        {/* Order Placed */}
        <div className="flex items-start mb-6 relative">
          <div className="flex flex-col items-center mr-4">
            <div className="bg-white p-1 rounded-full border border-gray-300">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Prep For Delivery</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(selectedDelivery["CREATED AT"] || "") ||
                "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Courier: </strong>
              {selectedDelivery.COURIER}
            </p>
          </div>
        </div>

        {/* In Transit */}
        <div className="flex items-start mb-6 relative">
          <div className="flex flex-col items-center mr-4">
            <div className="bg-white p-1 rounded-full border border-gray-300">
              <Truck className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">In Transit</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime("2026-01-11T08:45:00Z")}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Location: </strong>
              {selectedDelivery["LAST LOCATION"]}
            </p>
          </div>
        </div>

        {/* Delivered */}
        <div className="flex items-start mb-6 relative">
          <div className="flex flex-col items-center mr-4">
            <div className="bg-white p-1 rounded-full border border-gray-300">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Delivered</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime("2026-01-12T14:15:00Z")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
