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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PO } from "@/db/types/po";
import { Ellipsis, Plus, Trash } from "lucide-react";

type ShipmentFormData = {
  fleetId: string;
  driverId: string;
  from: string;
  to: string;
  expectedDelivery: string;
  actualDelivery: string;
  currentLocation: string;
  remarks: string;
  pos: PO[];
};

type Driver = { ID: string; NAME: string };
type Fleet = { ID: string; "PLATE NUMBER": string; MODEL: string };

export default function ShipmentForm() {
  const [form, setForm] = useState<ShipmentFormData>({
    fleetId: "",
    driverId: "",
    from: "",
    to: "",
    expectedDelivery: "",
    actualDelivery: "",
    currentLocation: "",
    remarks: "",
    pos: [],
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [pos, setPO] = useState<PO[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function addToList(po: PO) {
    setForm((prev) => {
      const exists = prev.pos.some((p) => po["ID"] === po["ID"]);

      // if (exists) return prev; // no change

      return {
        ...prev,
        pos: [...prev.pos, po],
      };
    });
  }

  function removeFromList(id: PO["ID"]) {
    setForm((prev) => ({
      ...prev,
      pos: prev.pos.filter((po) => po["ID"] !== id),
    }));
  }

  async function getAllPO(page = 1, limit = 10) {
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const response = await axios.get(url, {
        params: {
          action: "purchase-order",
          path: "get-all-po",
          page,
          limit,
        },
      });

      console.log(response.data);

      setPO(response.data?.data || []);
    } catch (error) {
    } finally {
    }
  }

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

    getAllPO();
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

      console.log({
        action: "shipment",
        path: "create-shipment",
        ...form,
      });

      if (res.data?.success) {
        setSuccess(true);
        setForm({
          fleetId: "",
          driverId: "",
          from: "",
          to: "",
          expectedDelivery: "",
          actualDelivery: "",
          currentLocation: "",
          remarks: "",
          pos: [],
        });
      } else {
        console.log(res);
        setError(res.data?.message || "Unknown error");
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Create New Shipment</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Fleet</Label>
                <Select
                  value={form.fleetId.toString()}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, fleetId: val.toString() }))
                  }
                >
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Included PO</CardTitle>
        </CardHeader>

        <CardContent>
          {/* included po list */}
          <Table>
            <TableCaption>A list of your recent PO.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>PO NUMBER</TableHead>
                <TableHead>ISSUE DATE</TableHead>
                <TableHead>CREATED AT</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.pos.map((po, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{po.ID}</TableCell>
                  <TableCell>{po["PO NUMBER"]}</TableCell>
                  <TableCell>
                    {new Date(po["ISSUE DATE"]).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(po["CREATED AT"]).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button onClick={(e) => removeFromList(po.ID)}>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* po list */}
          <h2>List</h2>
          <Table>
            <TableCaption>A list of your recent PO.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>PO NUMBER</TableHead>
                <TableHead>ISSUE DATE</TableHead>
                <TableHead>CREATED AT</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pos.map((po, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{po.ID}</TableCell>
                  <TableCell>{po["PO NUMBER"]}</TableCell>
                  <TableCell>
                    {new Date(po["ISSUE DATE"]).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(po["CREATED AT"]).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => addToList(po)}>
                      <Plus />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
