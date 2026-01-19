"use client";

import { ChartData } from "@/db/types/chart-data";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomTooltip from "../tooltips/custom-tooltip";

type Mode = "week" | "year";

export function TotalBarChart() {
  const [mode, setMode] = useState<Mode>("week");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      const url =
        mode === "week"
          ? `${process.env.NEXT_PUBLIC_GAS_LINK}?action=stats&path=get-week-stats`
          : `${process.env.NEXT_PUBLIC_GAS_LINK}?action=stats&path=get-year-stats`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      let transformed: ChartData[] =
        mode === "week"
          ? json.order.map(
              (day: string): ChartData => ({
                name: day,
                Delivered: json.days[day].Delivered,
                Completed: json.days[day].Completed,
                Returns: json.days[day].Returns,
                InTransit: json.days[day]["In Transit"],
                Total: json.days[day].Total,
              })
            )
          : json.order.map(
              (month: string): ChartData => ({
                name: month,
                Delivered: json.months[month].Delivered,
                Completed: json.months[month].Completed,
                Returns: json.months[month].Returns,
                InTransit: json.months[month]["In Transit"],
                Total: json.months[month].Total,
              })
            );

      // Reorder week: rolling 7 days ending today
      if (mode === "week") {
        const today = new Date();
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);

        const orderedLabels: string[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          const label = d.toLocaleDateString("en-US", {
            weekday: "short",
            timeZone: tz,
          });
          orderedLabels.push(label);
        }

        transformed = orderedLabels.map(
          (lbl) =>
            transformed.find((d) => d.name === lbl) || {
              name: lbl,
              Delivered: 0,
              Completed: 0,
              Returns: 0,
              InTransit: 0,
              Total: 0,
            }
        );
      }

      setData(transformed);
      setLoading(false);
    }

    loadStats();
  }, [mode]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div>
          <CardTitle>Total Deliveries</CardTitle>
          <CardDescription>
            Shows the total count of completed deliveries.
          </CardDescription>
        </div>

        {/* Tabs inside chart */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Loading…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                horizontal
                vertical={false}
                strokeDasharray="3 3"
                strokeOpacity={0.25}
              />

              <XAxis dataKey="name" tickLine={false} axisLine={false} />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickCount={20}
                hide
              />

              <Tooltip cursor={false} content={<CustomTooltip />} />

              <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
