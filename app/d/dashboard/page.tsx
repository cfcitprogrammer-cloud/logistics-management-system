import DashboardStats from "@/components/custom/dashboard/dashboard-stats";
import ShipmentStats from "@/components/custom/dashboard/shipment-stats";

export default function DashboardPage() {
  return (
    <div>
      <header className="col-span-full border-0 border-l-4 pl-2 border-l-primary mb-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm">
          A real-time overview of inventory, orders, and shipments
        </p>
      </header>

      <section className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <DashboardStats />
        </div>

        <div className="col-span-2">
          <ShipmentStats />
        </div>
      </section>
    </div>
  );
}
