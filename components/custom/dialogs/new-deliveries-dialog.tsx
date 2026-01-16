"use client";

import { useEffect, useState } from "react";
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
import { newDeliverySchema, NewDeliveryFormValues } from "@/db/schema/delivery";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

interface NewDeliveriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  po: PO | null;
  setKey: React.Dispatch<React.SetStateAction<number>>;
}

// Map picker component
function MapPicker({
  onSelect,
}: {
  onSelect: (latlng: [number, number]) => void;
}) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      setMarkerPos([e.latlng.lat, e.latlng.lng]);
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

export default function NewDeliveriesDialog({
  open,
  onOpenChange,
  po,
  setKey,
}: NewDeliveriesDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewDeliveryFormValues>({
    resolver: zodResolver(newDeliverySchema),
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      fromLat: 0,
      fromLng: 0,
      toLat: 0,
      toLng: 0,
      deliveryDate: "",
      trackingId: "",
      courier: "",
    },
  });

  // States for inputs and dropdowns
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [showFromMap, setShowFromMap] = useState(false);
  const [showToMap, setShowToMap] = useState(false);

  const debouncedFrom = useDebounce(fromInput, 400);
  const debouncedTo = useDebounce(toInput, 400);

  // Prefill from PO
  useEffect(() => {
    if (!po) return;

    reset({
      fromLocation: "",
      toLocation: po["DELIVERY ADDRESS"] || "",
      fromLat: 0,
      fromLng: 0,
      toLat: 0,
      toLng: 0,
      deliveryDate: "",
      trackingId: "",
      courier: "",
    });

    setToInput(po["DELIVERY ADDRESS"] || "");
  }, [po, reset]);

  // Fetch Nominatim suggestions
  const handleAutocomplete = async (value: string, type: "from" | "to") => {
    if (!value) {
      type === "from" ? setFromSuggestions([]) : setToSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          value
        )}&format=jsonv2&addressdetails=1&limit=5`
      );
      const data = await res.json();
      if (type === "from") setFromSuggestions(data);
      else setToSuggestions(data);
    } catch (err) {
      console.error("Nominatim error:", err);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debouncedFrom) handleAutocomplete(debouncedFrom, "from");
    else setFromSuggestions([]);
  }, [debouncedFrom]);

  useEffect(() => {
    if (debouncedTo) handleAutocomplete(debouncedTo, "to");
    else setToSuggestions([]);
  }, [debouncedTo]);

  // Submit
  const onSubmit = async (values: NewDeliveryFormValues) => {
    if (!po) return;

    const payload = {
      action: "deliveries",
      path: "create",
      poId: po.ID,
      fromLocation: values.fromLocation,
      toLocation: values.toLocation,
      fromLat: values.fromLat,
      fromLng: values.fromLng,
      toLat: values.toLat,
      toLng: values.toLng,
      deliveryDate: values.deliveryDate,
      trackingId: values.trackingId || "",
      courier: values.courier,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify(payload)
      );

      if (response.data?.success) {
        reset({
          fromLocation: "",
          toLocation: "",
          fromLat: 0,
          fromLng: 0,
          toLat: 0,
          toLng: 0,
          deliveryDate: "",
          trackingId: "",
          courier: "",
        });

        setFromInput("");
        setToInput("");
        setKey((prev) => prev + 1);
        toast.success("Delivery created successfully!");
        onOpenChange(false);
      } else {
        toast.error(`Error: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error: any) {
      toast.error(`Error creating delivery: ${error.message}`);
    }
  };

  function handleChange(isOpen: boolean) {
    reset({
      fromLocation: "",
      toLocation: "",
      fromLat: 0,
      fromLng: 0,
      toLat: 0,
      toLng: 0,
      deliveryDate: "",
      trackingId: "",
      courier: "",
    });

    setFromInput("");
    setToInput("");

    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleChange}>
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

            {/* Hidden fields for coordinates */}
            <input type="hidden" {...register("fromLat")} />
            <input type="hidden" {...register("fromLng")} />
            <input type="hidden" {...register("toLat")} />
            <input type="hidden" {...register("toLng")} />

            {/* From Location */}
            <div className="space-y-1 relative">
              <Label htmlFor="fromLocation">From Location</Label>
              <Input
                id="fromLocation"
                {...register("fromLocation")}
                autoComplete="off"
                value={fromInput}
                onFocus={() => setFromDropdownOpen(true)}
                onChange={(e) => {
                  setFromInput(e.target.value);
                  setValue("fromLocation", e.target.value);
                  setFromDropdownOpen(true);
                }}
                onBlur={() => setTimeout(() => setFromDropdownOpen(false), 150)}
              />

              {fromDropdownOpen && (
                <ul className="absolute z-50 bg-background border rounded w-full max-h-40 overflow-y-auto mt-1 shadow">
                  {fromSuggestions.length > 0 ? (
                    fromSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 hover:bg-accent cursor-pointer"
                        onMouseDown={() => {
                          setFromInput(s.display_name);
                          setValue("fromLocation", s.display_name);
                          setValue("fromLat", parseFloat(s.lat));
                          setValue("fromLng", parseFloat(s.lon));
                          setFromSuggestions([]);
                          setFromDropdownOpen(false);
                        }}
                      >
                        {s.display_name}
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-1 text-sm text-muted-foreground">
                      No results found
                      <p
                        className="mt-1 cursor-pointer text-blue-500 hover:underline"
                        onMouseDown={() => setShowFromMap(true)}
                      >
                        Pick on map
                      </p>
                    </li>
                  )}
                </ul>
              )}
              {errors.fromLocation && (
                <p className="text-sm text-destructive">
                  {errors.fromLocation.message}
                </p>
              )}
            </div>

            {/* To Location */}
            <div className="space-y-1 relative">
              <Label htmlFor="toLocation">To / Delivery Address</Label>
              <Input
                id="toLocation"
                {...register("toLocation")}
                autoComplete="off"
                value={toInput}
                onFocus={() => setToDropdownOpen(true)}
                onChange={(e) => {
                  setToInput(e.target.value);
                  setValue("toLocation", e.target.value);
                  setToDropdownOpen(true);
                }}
                onBlur={() => setTimeout(() => setToDropdownOpen(false), 150)}
              />
              {toDropdownOpen && (
                <ul className="absolute z-50 bg-background border rounded w-full max-h-40 overflow-y-auto mt-1 shadow">
                  {toSuggestions.length > 0 ? (
                    toSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-2 py-1 hover:bg-accent cursor-pointer"
                        onMouseDown={() => {
                          setToInput(s.display_name);
                          setValue("toLocation", s.display_name);
                          setValue("toLat", parseFloat(s.lat));
                          setValue("toLng", parseFloat(s.lon));
                          setToSuggestions([]);
                          setToDropdownOpen(false);
                        }}
                      >
                        {s.display_name}
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-1 text-sm text-muted-foreground">
                      No results found
                      <p
                        className="mt-1 cursor-pointer text-blue-500 hover:underline"
                        onMouseDown={() => setShowToMap(true)}
                      >
                        Pick on map
                      </p>
                    </li>
                  )}
                </ul>
              )}
              {errors.toLocation && (
                <p className="text-sm text-destructive">
                  {errors.toLocation.message}
                </p>
              )}
            </div>

            {/* Map Pickers */}
            {showFromMap && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                <div className="bg-background rounded w-11/12 max-w-md p-4">
                  <h3 className="font-semibold mb-2">Pick From Location</h3>
                  <MapContainer
                    center={[14.5995, 120.9842]}
                    zoom={13}
                    className="h-64 w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution=""
                    />
                    <MapPicker
                      onSelect={(latlng) => {
                        setValue("fromLocation", `${latlng[0]}, ${latlng[1]}`);
                        setFromInput(`${latlng[0]}, ${latlng[1]}`);
                        setValue("fromLat", latlng[0]);
                        setValue("fromLng", latlng[1]);
                        setShowFromMap(false);
                        setFromSuggestions([]);
                        setFromDropdownOpen(false);
                      }}
                    />
                  </MapContainer>
                  <Button
                    className="mt-2"
                    onClick={() => setShowFromMap(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}

            {showToMap && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                <div className="bg-background rounded w-11/12 max-w-md p-4">
                  <h3 className="font-semibold mb-2">Pick To Location</h3>
                  <MapContainer
                    center={[14.5995, 120.9842]}
                    zoom={13}
                    className="h-64 w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution=""
                    />
                    <MapPicker
                      onSelect={(latlng) => {
                        setValue("toLocation", `${latlng[0]}, ${latlng[1]}`);
                        setToInput(`${latlng[0]}, ${latlng[1]}`);
                        setValue("toLat", latlng[0]);
                        setValue("toLng", latlng[1]);
                        setShowToMap(false);
                        setToSuggestions([]);
                        setToDropdownOpen(false);
                      }}
                    />
                  </MapContainer>
                  <Button className="mt-2" onClick={() => setShowToMap(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}

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

            {/* Courier */}
            <div className="space-y-1">
              <Label htmlFor="courier">Courier</Label>
              <Input id="courier" {...register("courier")} />
              {errors.courier && (
                <p className="text-sm text-destructive">
                  {errors.courier.message}
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
