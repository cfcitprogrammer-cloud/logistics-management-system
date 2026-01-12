"use client";

import { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Zod schema for manual fallback
const trackerSchema = z.object({
  trackerId: z.string().min(1, "Tracker ID is required"),
  passkey: z.string().min(1, "Passkey is required"),
});

type TrackerFormData = z.infer<typeof trackerSchema>;

export default function TrackerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [useFormFallback, setUseFormFallback] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackerFormData>({
    resolver: zodResolver(trackerSchema),
  });

  const onSubmit = (data: TrackerFormData) => {
    console.log("Manual fallback submitted:", data);
    setScanResult(`Tracker ID: ${data.trackerId}, Passkey: ${data.passkey}`);
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const firstCode = detectedCodes[0];
      setScanResult(firstCode.rawValue);
      console.log(
        `Scanned: ${firstCode.rawValue} (format: ${firstCode.format})`
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Tracker</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!useFormFallback ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Scan QR code to track your delivery
              </p>

              <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                <Scanner
                  onScan={handleScan}
                  onError={(err) => console.error(err)}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setUseFormFallback(true)}
              >
                Enter manually
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracker ID
                </label>
                <Input {...register("trackerId")} />
                {errors.trackerId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.trackerId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Passkey
                </label>
                <Input {...register("passkey")} type="password" />
                {errors.passkey && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passkey.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Track
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setUseFormFallback(false)}
              >
                Scan QR code instead
              </Button>
            </form>
          )}

          {scanResult && (
            <>
              <Separator />
              <p className="text-sm text-green-600 break-words">
                Result: {scanResult}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
