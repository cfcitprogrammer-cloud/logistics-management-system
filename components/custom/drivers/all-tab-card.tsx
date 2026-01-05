"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DriverCard from "./driver-card";
import { Driver } from "@/db/types/driver";
import { useState } from "react";
import Link from "next/link";

interface AllTabCardProps {
  data: Driver[];
  onSearch?: (query: string) => void; // optional search callback
  onAdd?: () => void; // optional add driver callback
}

export default function AllTabCard({ data, onSearch, onAdd }: AllTabCardProps) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(search);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Input
          placeholder="Search drivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />

        <CardAction className="space-x-2">
          <Button onClick={handleSearch}>Search</Button>

          <Link href={"/d/drivers/new"}>
            <Button>Add Driver</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length === 0 ? (
          <p className="col-span-full text-center text-sm text-gray-500">
            No drivers found.
          </p>
        ) : (
          data.map((driver) => <DriverCard driver={driver} key={driver.ID} />)
        )}
      </CardContent>

      <CardFooter>
        Showing {data.length} of {data.length} results
      </CardFooter>
    </Card>
  );
}
