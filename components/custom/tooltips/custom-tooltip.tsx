import { TooltipProps } from "recharts";

type CustomTooltipProps = TooltipProps<number, string>;

export default function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="mb-2 text-xs font-semibold">{label}</p>

      <div className="grid grid-cols-2 gap-2">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2 w-2 text-xs font-semibold border border-gray-200 rounded-xs"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="text-xs">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
