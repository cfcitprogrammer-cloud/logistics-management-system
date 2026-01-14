"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrackerPage() {
  const [manualFallback, setManualFallback] = useState(false);
  const [trackerId, setTrackerId] = useState("");
  const router = useRouter();

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const firstCode = detectedCodes[0];
      const parsed = JSON.parse(firstCode.rawValue);

      router.push(`/tracker/now/${parsed}`);
    }
  };

  const handleTrack = () => {
    if (trackerId.trim()) {
      router.push(`/tracker/now/${trackerId}`);
    } else {
      // Optional: Display an alert or feedback for empty tracker ID
      alert("Please enter a tracker ID");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Delivery Tracker</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!manualFallback ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Scan QR code to track your delivery
              </p>

              <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                <Scanner
                  onScan={handleScan}
                  onError={(err) => console.error("Scanner error:", err)}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setManualFallback(true)}
              >
                Enter manually
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracker ID
                </label>
                <Input
                  onChange={(e) => setTrackerId(e.target.value)}
                  value={trackerId}
                />
              </div>

              <Button type="button" className="w-full" onClick={handleTrack}>
                Track
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setManualFallback(false)}
              >
                Scan QR code instead
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
