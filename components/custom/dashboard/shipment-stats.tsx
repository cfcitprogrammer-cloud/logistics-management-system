import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function ShipmentStats() {
  return (
    <div className="p-4 bg-card shadow-sm rounded-xl">
      Shipment Stats
      {/* <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="var(--color-desktop)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="mobile"
            stackId="a"
            fill="var(--color-mobile)"
            radius={[4, 4, 0, 0]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer> */}
    </div>
  );
}
