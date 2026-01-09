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
import { ButtonGroup } from "@/components/ui/button-group";
import { DriverEmpty } from "./empty-driver";

interface DriverListProps {
  data: Driver[];
  loading: boolean;
  totalRecords?: number; // total drivers for pagination
  pageSize?: number;
  currentPage?: number;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onAdd?: () => void;
}

export default function DriverList({
  data,
  loading,
  totalRecords = 0,
  pageSize = 10,
  currentPage = 1,
  onSearch,
  onPageChange,
  onAdd,
}: DriverListProps) {
  const [search, setSearch] = useState("");

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSearch = () => {
    if (onSearch) onSearch(search);
  };

  const handlePrev = () => {
    if (onPageChange) onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    if (onPageChange) onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <Card>
      {/* Header with search and add button */}
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

      {/* Driver cards */}
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-full text-center text-sm text-gray-500">
            Loading...
          </p>
        ) : data.length === 0 ? (
          <div className="col-span-full text-center text-sm text-gray-500">
            <DriverEmpty />
          </div>
        ) : (
          data.map((driver) => <DriverCard driver={driver} key={driver.ID} />)
        )}
      </CardContent>

      {/* Pagination always visible */}
      <CardFooter className="flex justify-between items-center">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <ButtonGroup>
          <Button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
