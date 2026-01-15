"use client";

import DriverList from "@/components/custom/drivers/driver-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Driver } from "@/db/types/driver";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DriversPage() {
  const [data, setData] = useState<Driver[]>([]);
  const [available, setAvailable] = useState<Driver[]>([]);
  const [onRoute, setOnRoute] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // show 9 drivers per page
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch drivers from GAS
  async function getAllDrivers(page = 1, query = "") {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
      const response = await axios.get(url, {
        params: {
          action: "driver",
          path: "get-all-drivers",
          page,
          limit: pageSize,
          search: query,
        },
      });

      const fetchedData: Driver[] = response.data?.data || [];
      const total: number = response.data?.totalPages || fetchedData.length;
      console.log(response.data);

      setData(fetchedData);
      setTotalRecords(total);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }

  // Update Available and OnRoute lists whenever data changes
  useEffect(() => {
    setAvailable(data.filter((d) => d.STATUS === "Available"));
    setOnRoute(data.filter((d) => d.STATUS === "On Route"));
  }, [data]);

  // Initial fetch
  useEffect(() => {
    getAllDrivers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Handlers for search and page change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // reset page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddDriver = () => {
    console.log("Add Driver clicked");
    // navigate to add driver page or open modal
  };

  return (
    <section className="grid grid-cols-3 gap-4">
      <Tabs defaultValue="all" className="col-span-full">
        <TabsList>
          <TabsTrigger value="all">All ({data.length})</TabsTrigger>
          <TabsTrigger value="available">
            Available ({available.length})
          </TabsTrigger>
          <TabsTrigger value="on-route">
            On Route ({onRoute.length})
          </TabsTrigger>
        </TabsList>

        {/* All Drivers */}
        <TabsContent value="all">
          <DriverList
            data={data}
            loading={loading}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onAdd={handleAddDriver}
          />
        </TabsContent>

        {/* Available Drivers */}
        <TabsContent value="available">
          <DriverList
            data={available}
            loading={loading}
            totalRecords={available.length}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onAdd={handleAddDriver}
          />
        </TabsContent>

        {/* On Route Drivers */}
        <TabsContent value="on-route">
          <DriverList
            data={onRoute}
            loading={loading}
            totalRecords={onRoute.length}
            pageSize={pageSize}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onAdd={handleAddDriver}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
