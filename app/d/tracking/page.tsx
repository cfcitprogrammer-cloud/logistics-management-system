import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TrackingPage() {
  return (
    <section>
      <aside>
        <header>
          <Input placeholder="Track your shipment..." />
          <Button>Track</Button>
        </header>
      </aside>

      <aside></aside>
    </section>
  );
}
