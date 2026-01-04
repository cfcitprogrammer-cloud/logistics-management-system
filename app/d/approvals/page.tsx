"use client";

import axios from "axios";
import AccountingApproval from "@/components/custom/approval/accounting";
import WarehouseApproval from "@/components/custom/approval/warehouse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PO } from "@/db/types/po";
import { useEffect, useState } from "react";

export default function ApprovalsPage() {
  const [data, setData] = useState<PO[]>([]);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null); // track selected PO

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

      const data = response.data?.data || [];
      setData(data);
    } catch (error) {
      console.error("Error fetching PO data:", error);
      setData([]);
    }
  }

  useEffect(() => {
    getAllPO();
  }, []);

  return (
    <section>
      <Tabs defaultValue="accounting" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
        </TabsList>
        <TabsContent value="accounting">
          <AccountingApproval />
        </TabsContent>
        <TabsContent value="warehouse">
          <WarehouseApproval />
        </TabsContent>
      </Tabs>
    </section>
  );
}
