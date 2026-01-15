"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartData } from "@/db/types/chart-data";

type Mode = "week" | "year";

export function StatusLineChart() {
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
                Returns: json.days[day].Returned,
                InTransit: json.days[day]["In Transit"],
                Total: json.days[day].Total,
              })
            )
          : json.order.map(
              (month: string): ChartData => ({
                name: month,
                Delivered: json.months[month].Delivered,
                Completed: json.months[month].Completed,
                Returns: json.months[month].Returned,
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
        <CardTitle>Status Trend</CardTitle>

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
            <AreaChart data={data}>
              {/* Horizontal grid lines only */}
              <CartesianGrid
                horizontal
                vertical={false}
                strokeDasharray="3 3"
                strokeOpacity={0.25}
              />

              {/* Hidden axes (used only for scaling) */}
              <XAxis dataKey="name" />
              <YAxis hide allowDecimals={false} tickCount={20} />

              {/* Tooltip without hover line */}
              <Tooltip cursor={false} />

              {/* Areas */}
              <Area
                type="monotone"
                dataKey="Delivered"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#DeliveredGradient)"
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="Completed"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#CompletedGradient)"
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="Returns"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#ReturnsGradient)"
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="InTransit"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#InTransitGradient)"
                activeDot={{ r: 5 }}
              />

              {/* Gradients */}
              <defs>
                <linearGradient
                  id="DeliveredGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="CompletedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="ReturnsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="InTransitGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
