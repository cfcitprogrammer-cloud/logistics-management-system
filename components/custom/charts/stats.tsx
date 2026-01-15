"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TodayStatsData = {
  Delivered: number;
  Completed: number;
  Returns: number;
  InTransit: number;
  Total: number;
};

const STAT_CONFIG = [
  {
    label: "Delivered",
    key: "Delivered",
    bg: "bg-green-50",
    text: "text-green-900",
  },
  {
    label: "Completed",
    key: "Completed",
    bg: "bg-blue-50",
    text: "text-blue-900",
  },
  { label: "Returns", key: "Returns", bg: "bg-red-50", text: "text-red-900" },
  {
    label: "In Transit",
    key: "InTransit",
    bg: "bg-yellow-50",
    text: "text-yellow-900",
  },
  {
    label: "Total Orders",
    key: "Total",
    bg: "bg-purple-50",
    text: "text-purple-900",
  },
] as const;

export default function TodayStats() {
  const [data, setData] = useState<TodayStatsData | null>(null);
  const [yesterdayData, setYesterdayData] = useState<TodayStatsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GAS_LINK}?action=stats&path=get-week-stats`,
        { cache: "no-store" }
      );
      const json = await res.json();

      const todayLabel = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });
      const yesterdayLabel = new Date();
      yesterdayLabel.setDate(yesterdayLabel.getDate() - 1);
      const yesterdayShort = yesterdayLabel.toLocaleDateString("en-US", {
        weekday: "short",
      });

      const todayStats = json.days[todayLabel] || {
        Delivered: 0,
        Completed: 0,
        Returns: 0,
        "In Transit": 0,
        Total: 0,
      };

      const yesterdayStats = json.days[yesterdayShort] || {
        Delivered: 0,
        Completed: 0,
        Returns: 0,
        "In Transit": 0,
        Total: 0,
      };

      setData({
        Delivered: todayStats.Delivered,
        Completed: todayStats.Completed,
        Returns: todayStats.Returned,
        InTransit: todayStats["In Transit"],
        Total: todayStats.Total,
      });

      setYesterdayData({
        Delivered: yesterdayStats.Delivered,
        Completed: yesterdayStats.Completed,
        Returns: yesterdayStats.Returned,
        InTransit: yesterdayStats["In Transit"],
        Total: yesterdayStats.Total,
      });

      setLoading(false);
    }

    fetchStats();
  }, []);

  function getInsight(
    today: number,
    yesterday: number
  ): { text: string; variant: "secondary" | "destructive" | "default" } {
    if (yesterday === 0 && today === 0)
      return { text: "No change", variant: "secondary" };
    if (yesterday === 0) return { text: "↑ 100% increase", variant: "default" };
    const diff = today - yesterday;
    const percent = Math.abs(Math.round((diff / yesterday) * 100));
    if (diff > 0) return { text: `↑ ${percent}% higher`, variant: "default" }; // default = greenish badge
    if (diff < 0)
      return { text: `↓ ${percent}% lower`, variant: "destructive" };
    return { text: "No change", variant: "secondary" };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!data || !yesterdayData) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No stats available for today
      </div>
    );
  }

  return (
    <div className="grid col-span-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {STAT_CONFIG.map((stat) => {
        const insight = getInsight(data[stat.key], yesterdayData[stat.key]);
        return (
          <Card key={stat.key}>
            <CardContent className="space-y-1">
              <p className="text-sm font-medium">{stat.label}</p>
              <p className={`text-4xl font-bold`}>{data[stat.key]}</p>
              <Badge variant={insight.variant}>{insight.text}</Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
