"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusLineChart } from "@/components/custom/charts/status-chart";
import { TotalBarChart } from "@/components/custom/charts/totals-chart";
import TodayStats from "@/components/custom/charts/stats";

type Mode = "week" | "year";

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <header className="col-span-full border-0 border-l-4 pl-2 border-l-primary">
            <h1 className="text-sm font-semibold">Dashboard</h1>
            <p className="text-sm">Delivery data, simplified</p>
          </header>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-full">
            <TodayStats />
          </div>
          <StatusLineChart />
          <TotalBarChart />
        </div>
      </div>
    </section>
  );
}
