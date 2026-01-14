"use client";

import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Props
interface DispatchDeliveryQRDialogProps {
  trackingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DispatchDeliveryQRDialog({
  trackingId,
  open,
  onOpenChange,
}: DispatchDeliveryQRDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] w-[90%]">
        <DialogHeader>
          <DialogTitle>Dispatch Delivery</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-4 text-center">
          Scan the QR code to release the delivery into transit
        </p>

        <div className="bg-background p-4 rounded mb-4 flex justify-center">
          <QRCode value={trackingId} size={220} level="H" />
        </div>

        <div className="text-sm text-center space-y-1 mb-4">
          <p>
            <strong>Tracking ID:</strong> {trackingId}
          </p>
        </div>

        <DialogClose className="mt-2 w-full rounded bg-primary px-4 py-2 text-white">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
