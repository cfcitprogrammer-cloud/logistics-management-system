"use client";

import Stat from "@/components/custom/stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClockFading,
  Ellipsis,
  Package,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

type Shipment = {
  ID: string;
  "PO ID": string;
  "FLEET ID": string;
  "DRIVER ID": string;
  FROM: string;
  TO: string;
  "EXPECTED DELIVERY DATE": string;
  "ACTUAL DELIVERY DATE": string;
  "CURRENT LOCATION": string;
  REMARKS: string;
  STATUS: string;
};

export default function ShipmentsPage() {
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  async function getAllShipments() {
    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const res = await axios.get(url, {
        params: {
          action: "shipment",
          path: "get-all-shipments",
          page: 1,
          limit: 50,
        },
      });

      setShipments(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllShipments();
  }, []);

  return (
    <section className="space-y-4">
      <header className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Stat
          title="Total Shipments"
          icon={Truck}
          value={shipments.length.toString()}
        />
        <Stat
          title="Pending"
          icon={ClockFading}
          value={shipments
            .filter((s) => s.STATUS === "Pending")
            .length.toString()}
        />
        <Stat
          title="Delivery"
          icon={Package}
          value={shipments
            .filter((s) => s.STATUS === "In Transit")
            .length.toString()}
        />
        <Stat
          title="Completed"
          icon={PackageCheck}
          value={shipments
            .filter((s) => s.STATUS === "Delivered")
            .length.toString()}
        />
      </header>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center gap-2">
          {/* <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
          </TabsList> */}

          <InputGroup className="w-50 ml-auto">
            <InputGroupInput placeholder="Search Shipment ID" />
            <InputGroupAddon align="inline-start">
              <Search className="w-5 h-5 text-gray-500" />
            </InputGroupAddon>
          </InputGroup>

          <Link href={"/d/shipments/new"}>
            <Button>New Shipment</Button>
          </Link>
        </div>

        {loading ? (
          <Spinner className="mx-auto" />
        ) : (
          <TabsContent
            value="all"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {shipments.map((shipment) => (
              <Card key={shipment.ID}>
                <CardHeader>
                  <CardTitle>#{shipment.ID}</CardTitle>
                  <CardDescription>
                    <Badge>{shipment.STATUS}</Badge>
                  </CardDescription>
                  <CardAction>
                    <Button variant={"ghost"}>
                      <Ellipsis />
                    </Button>
                  </CardAction>
                </CardHeader>

                <CardContent className="space-y-2">
                  <Separator className="mb-2" />

                  <div>
                    <p>
                      <strong>Assigned Driver: </strong>
                      John Doe
                    </p>
                  </div>

                  <div className="bg-gray-100 p-2 space-y-2 rounded">
                    <div className="flex justify-between items-start text-sm">
                      <p>Origin</p>
                      <div className="text-right">
                        <h2 className="font-semibold">{shipment.FROM}</h2>
                        <p>
                          {shipment["EXPECTED DELIVERY DATE"]
                            ? new Date(
                                shipment["EXPECTED DELIVERY DATE"]
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start text-sm">
                      <p>Destination</p>
                      <div className="text-right">
                        <h2 className="font-semibold">{shipment.TO}</h2>
                        <p>
                          {shipment["ACTUAL DELIVERY DATE"]
                            ? new Date(
                                shipment["ACTUAL DELIVERY DATE"]
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Current Location:</strong>
                      <p>{shipment["CURRENT LOCATION"]}</p>
                    </div>
                    <div>
                      <strong>Remarks:</strong>
                      <p>{shipment.REMARKS || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
