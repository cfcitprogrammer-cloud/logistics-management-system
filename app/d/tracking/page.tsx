import TrackingCard from "@/components/custom/tracking/tracking-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TrackingPage() {
  return (
    <section className="grid grid-cols-3 gap-4">
      <aside className="col-span-1">
        <header className="flex gap-2">
          <Input placeholder="Track your shipment..." />
          <Button>Track</Button>
        </header>

        <TrackingCard />
      </aside>

      <Card className="col-span-2">
        <CardContent>
          <div className="w-full aspect-w-16 aspect-h-9 bg-gray-500"></div>
        </CardContent>
      </Card>
    </section>
  );
}
