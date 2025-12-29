import { type LucideIcon, Truck } from "lucide-react";
import { Card, CardHeader, CardDescription, CardTitle } from "../ui/card";

export default function Stat({
  title,
  icon: Icon,
  value,
}: {
  title: string;
  icon: LucideIcon;
  value: string;
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon
            size={26}
            className="bg-primary p-1 text-primary-foreground rounded"
          />
          <span>{title}</span>
        </CardDescription>
        <CardTitle className="text-4xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
