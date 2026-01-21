"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Delivery } from "@/db/types/delivery";
import { shortenAddress } from "@/lib/address";
import { formatDateTime } from "@/lib/date";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrackerWidget() {
  const { id } = useParams();
  const [trackingDetails, setTrackingDetails] = useState<Delivery[] | null>(
    null,
  ); // For storing fetched data
  const [loading, setLoading] = useState(false); // Loading state
  const [showDetails, setShowDetails] = useState(false); // Control visibility of PO list

  useEffect(() => {
    const pingLocation = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let address = "";

          try {
            // Try reverse geocoding with Nominatim
            const nominatimRes = await axios.get(
              "https://nominatim.openstreetmap.org/reverse",
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  format: "json",
                },
                headers: {
                  "Accept-Language": "en", // optional, force English
                  "User-Agent": "YourAppName/1.0 (your@email.com)", // recommended by Nominatim
                },
                timeout: 5000, // timeout in case Nominatim is slow
              },
            );

            address = nominatimRes.data.display_name || "";
          } catch (err) {
            console.warn(
              "Nominatim reverse geocode failed, continuing without address.",
              err,
            );
          }

          try {
            // Send location (with or without address) to your API
            const res = await axios.post(
              process.env.NEXT_PUBLIC_GAS_LINK || "",
              JSON.stringify({
                action: "deliveries",
                path: "ping",
                lat: latitude,
                long: longitude,
                id,
                lastLocation: shortenAddress(address), // may be empty if reverse geocode failed
              }),
            );

            console.log("Location pinged:", latitude, longitude);
            if (address) console.log("Address:", address);
            console.log(res.data);
          } catch (err) {
            console.error("Failed to ping location", err);
          }
        },
        (err) => console.error("Geolocation error", err),
      );
    };

    // Ping immediately
    pingLocation();

    // Set an interval to ping every 15 minutes
    const interval = setInterval(pingLocation, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [id]);

  const handleTrackDetailsClick = async () => {
    if (!id) {
      console.error("No tracker ID available");
      return;
    }

    setLoading(true); // Set loading to true while fetching data
    try {
      // Send request to your Google Apps Script (GAS) endpoint
      const response = await axios.get(process.env.NEXT_PUBLIC_GAS_LINK || "", {
        params: {
          action: "deliveries",
          path: "get-all-po",
          trackingId: id,
        },
      });

      console.log(response.data);

      // Set the fetched tracking details to the state
      setTrackingDetails(response.data.data || []); // Assuming the data is in the `data` field
      setShowDetails(true); // Show the PO list after data is fetched
    } catch (err) {
      console.error("Error fetching tracking details", err);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  async function completeDelivery(poId: string) {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify({
          action: "",
          path: "",
          poId,
        }),
      );
    } catch (error) {}
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <span className="absolute inline-flex h-40 w-40 rounded-full bg-red-700 opacity-75 animate-ping"></span>
        <span className="absolute inline-flex h-52 w-52 rounded-full bg-red-700 opacity-50 animate-ping [animation-delay:0.75s]"></span>
        <span className="absolute inline-flex h-64 w-64 rounded-full bg-red-700 opacity-30 animate-ping [animation-delay:1.5s]"></span>
        {/* Center circle */}
        <div className="relative w-36 h-36 bg-red-700 rounded-full flex flex-col items-center justify-center text-center p-4 shadow-xl">
          <span className="text-white font-semibold text-sm">
            Tracking your delivery
          </span>
        </div>
      </div>

      {/* View All Tracker IDs Button */}
      <Button onClick={handleTrackDetailsClick} className="mt-6 z-10">
        {loading ? "Loading..." : "Refresh"}
      </Button>

      {/* Render Tracking Details if data is available */}
      {showDetails && trackingDetails && trackingDetails.length > 0 ? (
        <div className="space-y-4 mt-6">
          {/* Render details in a compact list */}
          {trackingDetails.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>#{item["PO NUMBER"]}</CardTitle>
                <CardDescription>
                  <Badge>{item.STATUS}</Badge>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="font-semibold text-sm ">Delivery Date:</p>
                <p className="text-xs">
                  {formatDateTime(item["DELIVERY DATE"].toString())}
                </p>
              </CardContent>

              <CardFooter>
                <a
                  href={`https://docs.google.com/forms/d/e/1FAIpQLSdiyM_i909B_dIluipvmiJwLunbAdTju-3TQEqpaXqr4vrGVg/viewform?usp=pp_url&entry.616516451=${item.ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">Complete Delivery</Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="mt-6 text-center">
            No data found for this tracker ID
          </div>
        )
      )}
    </div>
  );
}
