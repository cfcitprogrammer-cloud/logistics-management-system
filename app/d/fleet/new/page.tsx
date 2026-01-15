"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fleetSchema } from "@/db/schema/fleet";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Driver } from "@/db/types/driver";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DriverCardAlt from "@/components/custom/drivers/driver-card-alt";

export default function NewFleetPage() {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverLoading, setDriverLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverPage, setDriverPage] = useState(1);
  const [driverMaxPage, setDriverMaxPage] = useState(1);
  const [driverSearchInput, setDriverSearchInput] = useState("");
  const [driverSearchTerm, setDriverSearchTerm] = useState("");

  const form = useForm<z.infer<typeof fleetSchema>>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      plateNumber: "",
      model: "",
      loadCapacity: "",
      remarks: "",
    },
  });

  async function onSubmit(data: z.infer<typeof fleetSchema>) {
    if (!selectedDriver) {
      alert("Please assign a driver before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_GAS_LINK || "",
        JSON.stringify({
          action: "fleet",
          path: "create-fleet",
          ...data,
          riverId: selectedDriver.ID,
          currentDriver: selectedDriver.NAME,
        })
      );

      alert("Fleet created.");
      form.reset();
      setSelectedDriver(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Fleet not created");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDrivers(page = 1, limit = 10, search = "") {
    setDriverLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
      const res = await axios.get(url, {
        params: {
          action: "driver",
          path: "get-all-drivers",
          page,
          limit,
          search,
        },
      });

      setDrivers(res.data?.data || []);
      const totalPages = res.data?.totalPages || 1;
      setDriverMaxPage(totalPages);
    } catch (err) {
      console.error(err);
      setDrivers([]);
      setDriverMaxPage(1);
    } finally {
      setDriverLoading(false);
    }
  }

  // Fetch drivers whenever page or search term changes
  useEffect(() => {
    fetchDrivers(driverPage, 10, driverSearchTerm);
  }, [driverPage, driverSearchTerm]);

  const handleDriverSearch = () => {
    setDriverPage(1);
    setDriverSearchTerm(driverSearchInput);
  };

  const handleDriverKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDriverSearch();
  };

  return (
    <section>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          {/* Fleet form */}
          <Card className="col-span-1">
            <CardContent>
              <h1 className="font-semibold">Fleet Information</h1>
              <div className="grid grid-cols-1 gap-4">
                {/* Plate Number */}
                <Controller
                  name="plateNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Plate Number</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="ABC-1234"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Model */}
                <Controller
                  name="model"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Model</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Truck X"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Load Capacity */}
                <Controller
                  name="loadCapacity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Load Capacity
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="1000 kg"
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Remarks */}
                <Controller
                  name="remarks"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Remarks (optional)
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Any notes..."
                        className="bg-slate-100"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Add Fleet"}
              </Button>
            </CardFooter>
          </Card>

          {/* Driver assignment */}
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="font-semibold">Select a Driver</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search drivers..."
                    value={driverSearchInput}
                    onChange={(e) => setDriverSearchInput(e.target.value)}
                    onKeyDown={handleDriverKeyDown}
                  />
                  <Button onClick={handleDriverSearch}>Search</Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {driverLoading ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : drivers.length === 0 ? (
                <p className="text-center text-sm text-gray-500">
                  No drivers found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => {
                      const isSelected = selectedDriver?.ID === driver.ID;
                      return (
                        <TableRow
                          key={driver.ID}
                          className={`cursor-pointer ${
                            isSelected ? "bg-accent" : ""
                          }`}
                          onClick={() => setSelectedDriver(driver)}
                        >
                          <TableCell>{driver.ID}</TableCell>
                          <TableCell>{driver.NAME}</TableCell>
                          <TableCell>{driver.STATUS}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-2">
                <Button
                  onClick={() => setDriverPage((p) => Math.max(p - 1, 1))}
                  disabled={driverPage === 1}
                >
                  Prev
                </Button>
                <p>
                  Page {driverPage} of {driverMaxPage}
                </p>
                <Button
                  onClick={() =>
                    setDriverPage((p) => Math.min(p + 1, driverMaxPage))
                  }
                  disabled={driverPage === driverMaxPage}
                >
                  Next
                </Button>
              </div>

              {/* Show selected driver card */}
              {selectedDriver && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Selected Driver</h3>
                  <DriverCardAlt driver={selectedDriver} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </section>
  );
}
