"use client";

import AllTabCard from "@/components/custom/drivers/all-tab-card";
import AsideCard from "@/components/custom/drivers/aside-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Driver } from "@/db/types/driver";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

export default function DriversPage() {
  const [data, setData] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function getAllDrivers(page = 1, limit = 10, query = "") {
    setLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_GAS_LINK || "";

      const response = await axios.get(url, {
        params: {
          action: "driver",
          path: "get-all-drivers",
          page,
          limit,
          search: query, // optional search param
        },
      });

      const data = response.data?.data || [];
      setData(data);
    } catch (error) {
      console.error("Error fetching Drivers data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    getAllDrivers();
  }, []);

  // Handler for search from AllTabCard
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    getAllDrivers(1, 10, query);
  };

  // Optional: handler for "Add Driver" button
  const handleAddDriver = () => {
    // Redirect or open modal for new driver
    console.log("Add Driver clicked");
  };

  return (
    <section className="grid grid-cols-3 gap-4">
      <Tabs defaultValue="all" className="col-span-full">
        <TabsList>
          <TabsTrigger value="all">All ({data.length})</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="on-route">On Route</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <AllTabCard
              data={data}
              onSearch={handleSearch}
              onAdd={handleAddDriver}
            />
          )}
        </TabsContent>

        <TabsContent value="available">
          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <AllTabCard
              data={data.filter((d) => d.STATUS == "Available")}
              onSearch={handleSearch}
              onAdd={handleAddDriver}
            />
          )}
        </TabsContent>

        <TabsContent value="on-route">
          {loading ? (
            <Spinner className="mx-auto" />
          ) : (
            <AllTabCard
              data={data.filter((d) => d.STATUS == "On Route")}
              onSearch={handleSearch}
              onAdd={handleAddDriver}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* <AsideCard /> */}
    </section>
  );
}
