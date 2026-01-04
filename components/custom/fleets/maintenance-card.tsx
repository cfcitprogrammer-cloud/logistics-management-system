"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Fleet {
  ID: number;
  "PLATE NUMBER": string;
  MODEL: string;
  "LOAD CAPACITY": string;
  STATUS: string;
  "CURRENT LOCATION": string;
  "CURRENT DRIVER": string;
  "CURRENT DRIVER ID": string;
  "CREATED AT": string;
  REMARKS: string;
  "MAINTENANCE STARTS": string;
}

interface GasResponse {
  success?: boolean;
  message?: string;
  data?: Fleet[];
}

export default function MaintenanceCard() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFleets = async () => {
      try {
        const res = await axios.get<GasResponse>(
          `${process.env.NEXT_PUBLIC_GAS_LINK}?action=fleet&path=get-all-fleet`
        );

        if (res.data.success === false) {
          console.error("GAS Error:", res.data.message);
          setFleets([]);
        } else {
          // Filter only fleets that have a maintenance date
          const maintenanceFleets = (res.data.data || []).filter(
            (fleet) => fleet["MAINTENANCE STARTS"]
          );
          setFleets(maintenanceFleets);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFleets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading maintenance schedule...</p>
        ) : fleets.length === 0 ? (
          <p>No maintenance scheduled.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Maintenance Starts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fleets.map((fleet) => (
                <TableRow key={fleet.ID}>
                  <TableCell>{fleet.ID}</TableCell>
                  <TableCell>{fleet["PLATE NUMBER"]}</TableCell>
                  <TableCell>{fleet.MODEL}</TableCell>
                  <TableCell>{fleet.STATUS}</TableCell>
                  <TableCell>{fleet["MAINTENANCE STARTS"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
