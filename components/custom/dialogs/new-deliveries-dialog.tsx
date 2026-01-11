"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PO } from "@/db/types/po";
import { newDeliverySchema, NewDeliveryFormValues } from "@/db/schema/delivery"; // or same file
import axios from "axios";

interface NewDeliveriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PO | null;
}

export default function NewDeliveriesDialog({
  open,
  onOpenChange,
  po,
}: NewDeliveriesDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewDeliveryFormValues>({
    resolver: zodResolver(newDeliverySchema),
    defaultValues: {
      deliveryAddress: "",
      deliveryDate: "",
      trackingId: "",
    },
  });

  /* =========================
     Prefill from PO
  ========================= */
  useEffect(() => {
    if (!po) return;

    reset({
      deliveryAddress: po["DELIVERY ADDRESS"] || "",
      deliveryDate: "",
      trackingId: "",
    });
  }, [po, reset]);

  /* =========================
     Submit
  ========================= */

  const onSubmit = async (values: NewDeliveryFormValues) => {
    if (!po) return;

    const payload = {
      action: "deliveries",
      path: "create",
      poId: po.ID,
      deliveryAddress: values.deliveryAddress,
      deliveryDate: values.deliveryDate,
      trackingId: values.trackingId || "",
    };

    try {
      console.log("Sending delivery payload:", payload);

      const response = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify(payload)
      );

      if (response.data?.success) {
        console.log("Delivery created:", response.data.data);
        // ✅ optionally show toast
        alert("Delivery created successfully!");
        onOpenChange(false);
      } else {
        console.error("Failed to create delivery:", response.data?.message);
        alert(`Error: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Axios error creating delivery:", error);
      alert(`Error creating delivery: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Delivery</DialogTitle>
          <DialogDescription>
            Create a delivery for the selected purchase order.
          </DialogDescription>
        </DialogHeader>

        {!po ? (
          <p className="text-sm text-muted-foreground">
            No purchase order selected.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* PO ID */}
            <div className="space-y-1">
              <Label>PO ID</Label>
              <Input value={po.ID} disabled />
            </div>

            {/* Delivery Address */}
            <div className="space-y-1">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Input id="deliveryAddress" {...register("deliveryAddress")} />
              {errors.deliveryAddress && (
                <p className="text-sm text-destructive">
                  {errors.deliveryAddress.message}
                </p>
              )}
            </div>

            {/* Delivery Date */}
            <div className="space-y-1">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                {...register("deliveryDate")}
              />
              {errors.deliveryDate && (
                <p className="text-sm text-destructive">
                  {errors.deliveryDate.message}
                </p>
              )}
            </div>

            {/* Tracking ID */}
            <div className="space-y-1">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="Optional"
                {...register("trackingId")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create Delivery"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
