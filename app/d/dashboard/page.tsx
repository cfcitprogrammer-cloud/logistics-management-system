import DashboardStats from "@/components/custom/dashboard/dashboard-stats";
import ShipmentStats from "@/components/custom/dashboard/shipment-stats";

export default function DashboardPage() {
  return (
    <section className="grid grid-cols-4 gap-4">
      <div className="col-span-2">
        <DashboardStats />
      </div>

      <div className="col-span-2">
        <ShipmentStats />
      </div>
    </section>
  );
}
