"use client";

import "leaflet/dist/leaflet.css";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Delivery } from "@/db/types/delivery";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateTime } from "@/lib/date";
import TrackingTimeline from "./delivery-tracking";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDeliveryStatus } from "@/lib/delivery";
import { Copy, Ellipsis, MapPin } from "lucide-react";
import DispatchDeliveryQRDialog from "@/components/custom/dialogs/gen-qr"; // ShadCN dialog
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/clipboard";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// Tailwind Ping Dot as a Leaflet DivIcon
const createPingMarker = () => {
  return L.divIcon({
    className: "",
    html: `<div class="relative flex justify-center items-center">
            <span class="absolute inline-flex h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
           </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10], // center the dot
  });
};

const createLucidePingMarker = () => {
  return L.divIcon({
    className: "lucide-ping-marker",
    html: `
      <div class="relative flex justify-center items-center">
        <span class="relative inline-flex h-6 w-6">
          <${MapPin} class="text-red-600" size={24} />
        </span>
      </div>
    `,
    iconSize: [30, 30], // Adjust size of the marker
    iconAnchor: [15, 30], // Anchor the icon properly (adjust position if needed)
  });
};

// Optional: auto-fly map to marker
function FlyToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 19);
  }, [map, position]);
  return null;
}

interface DeliveryViewCardProps {
  selectedDelivery: Delivery | null;
}

export default function DeliveryViewCard({
  selectedDelivery,
}: DeliveryViewCardProps) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedDelivery) return null;

  const lat = selectedDelivery.LAT || 14.5995;
  const lng = selectedDelivery.LONG || 120.9842;
  const position: [number, number] = [lat, lng];

  async function updateStatus(status: string) {
    setLoading(true);

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify({
          action: "deliveries",
          path: "update-status",
          id: selectedDelivery?.ID,
          status,
        })
      );

      if (res.data?.success) {
        toast.success(`Marked as ${status.toUpperCase()}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="md:col-span-1">
      {loading && (
        <div className="w-full h-screen fixed top-0 left-0 bg-background z-20 flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <CardHeader>
        <CardTitle>
          #{selectedDelivery["TRACKING ID"]}{" "}
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() =>
              copyToClipboard(selectedDelivery["TRACKING ID"] || "")
            }
          >
            <Copy />
          </Button>
        </CardTitle>
        <CardDescription className="space-x-2">
          <Badge>{selectedDelivery.STATUS}</Badge>
          <span className="text-xs text-muted-foreground">
            {getDeliveryStatus(selectedDelivery["DELIVERY DATE"].toString())}
          </span>
        </CardDescription>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Open the QR Dialog */}
              <DropdownMenuItem onClick={() => setIsQRDialogOpen(true)}>
                Dispatch Delivery (QR)
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => updateStatus("Cancelled")}>
                Cancel Delivery
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => updateStatus("Delivered")}>
                Mark as Delivered
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => updateStatus("In Transit")}>
                Mark as In Transit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => updateStatus("Returned")}>
                Mark as Returned
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map */}
        <figure>
          {!selectedDelivery.LAT || !selectedDelivery.LONG ? (
            <div className="w-full h-64 bg-primary flex justify-center items-center">
              <p className="text-primary-foreground">Not Tracking Yet</p>
            </div>
          ) : (
            <MapContainer
              center={position}
              zoom={19}
              scrollWheelZoom={true}
              className="w-full h-64 z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={createPingMarker()}>
                <Popup>Current Location</Popup>
              </Marker>
              <FlyToMarker position={position} />

              <Marker
                position={[
                  selectedDelivery.LATFROM!,
                  selectedDelivery.LONGFROM!,
                ]}
                icon={createPingMarker()}
              >
                <Popup>Current Location</Popup>
              </Marker>
            </MapContainer>
          )}
        </figure>

        {/* Delivery Info */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Delivery Information</h2>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold">PO ID</h3>
              <p>{selectedDelivery["PO ID"]}</p>
            </div>

            <div>
              <h3 className="font-semibold">Target Delivery Date</h3>
              <p>
                {formatDate(selectedDelivery["DELIVERY DATE"].toString() || "")}
              </p>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4 col-span-full">
              <div className="flex flex-col relative ml-4">
                <div className="absolute left-1 top-2 bottom-0 w-0.5 bg-gray-300"></div>

                <div className="flex items-start mb-6 relative">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Origin</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDelivery.FROM || "Unknown"}
                    </p>
                    <p className="text-xs">
                      {formatDateTime(
                        selectedDelivery["DELIVERY DATE"].toString()
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start relative">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Destination</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDelivery["DELIVERY ADDRESS"] || "Unknown"}
                    </p>
                    <p className="text-xs">
                      {formatDateTime(
                        selectedDelivery["DELIVERY DATETIME"] || ""
                      ) || selectedDelivery.STATUS}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <TrackingTimeline selectedDelivery={selectedDelivery} />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dispatch QR Dialog */}
      <DispatchDeliveryQRDialog
        trackingId={selectedDelivery["TRACKING ID"]!}
        open={isQRDialogOpen}
        onOpenChange={setIsQRDialogOpen}
      />
    </Card>
  );
}
