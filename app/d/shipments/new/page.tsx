"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ShipmentFormData = {
  poId: number;
  fleetId: string;
  driverId: string;
  from: string;
  to: string;
  expectedDelivery: string;
  actualDelivery: string;
  currentLocation: string;
  remarks: string;
  status: "Pending" | "In Transit" | "Delivered" | "Out for Delivery";
};

type Driver = { ID: string; NAME: string };
type Fleet = { ID: string; "PLATE NUMBER": string; MODEL: string };

export default function ShipmentForm() {
  const [form, setForm] = useState<ShipmentFormData>({
    poId: 0,
    fleetId: "",
    driverId: "",
    from: "",
    to: "",
    expectedDelivery: "",
    actualDelivery: "",
    currentLocation: "",
    remarks: "",
    status: "Pending",
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [fleets, setFleets] = useState<Fleet[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch drivers and fleets from GAS
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

    async function fetchDrivers() {
      try {
        const res = await axios.get(url, {
          params: {
            action: "driver",
            path: "get-all-drivers",
            page: 1,
            limit: 100,
          },
        });
        setDrivers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    }

    async function fetchFleets() {
      try {
        const res = await axios.get(url, {
          params: {
            action: "fleet",
            path: "get-all-fleet",
            page: 1,
            limit: 100,
          },
        });
        setFleets(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch fleets:", err);
      }
    }

    fetchDrivers();
    fetchFleets();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const res = await axios.post(
        url,
        JSON.stringify({
          action: "shipment",
          path: "create-shipment",
          ...form,
        })
      );

      if (res.data?.success) {
        setSuccess(true);
        setForm({
          poId: 0,
          fleetId: "",
          driverId: "",
          from: "",
          to: "",
          expectedDelivery: "",
          actualDelivery: "",
          currentLocation: "",
          remarks: "",
          status: "Pending",
        });
      } else {
        setError(res.data?.message || "Unknown error");
      }
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>PO ID</Label>
              <Input
                type="text"
                name="poId"
                value={form.poId}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Fleet</Label>
              <Select
                value={form.fleetId.toString()}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, fleetId: val.toString() }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fleet" />
                </SelectTrigger>
                <SelectContent>
                  {fleets.map((fleet) => (
                    <SelectItem key={fleet.ID} value={String(fleet.ID)}>
                      {fleet.MODEL} ({fleet.ID})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Driver</Label>
              <Select
                value={form.driverId}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, driverId: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.ID} value={driver.ID}>
                      {driver.NAME} ({driver.ID})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>From</Label>
              <Input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>To</Label>
              <Input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Expected Delivery</Label>
              <Input
                type="date"
                name="expectedDelivery"
                value={form.expectedDelivery}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Actual Delivery</Label>
              <Input
                type="date"
                name="actualDelivery"
                value={form.actualDelivery}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Current Location</Label>
              <Input
                type="text"
                name="currentLocation"
                value={form.currentLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  status: val as ShipmentFormData["status"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Out for Delivery">
                  Out for Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Create Shipment"}
            </Button>
            {success && (
              <p className="text-green-600">Shipment created successfully!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
