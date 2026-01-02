import AllFleetsCard from "@/components/custom/fleets/all-fleets-card";
import FleetStatusCard from "@/components/custom/fleets/fleet-status-card";
import MaintenanceCard from "@/components/custom/fleets/maintenance-card";
import VehicleAlerts from "@/components/custom/fleets/vehicle-alerts";
import Stat from "@/components/custom/stat";
import { Pencil, Truck } from "lucide-react";

export default function FleetPage() {
  return (
    <section className="grid grid-cols-4 gap-4">
      <Stat title="Total Vehicles" icon={Truck} value="12" />
      <Stat title="Delayed Deliveries" icon={Truck} value="128" />
      <Stat title="On-Time Deliveries" icon={Truck} value="1,500" />
      <Stat title="Total Drivers" icon={Truck} value="16" />

      <div className="col-span-3">
        <AllFleetsCard />
      </div>

      <FleetStatusCard />

      <div className="col-span-3">
        <MaintenanceCard />
      </div>

      <VehicleAlerts />
    </section>
  );
}
