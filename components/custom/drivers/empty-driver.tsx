import { Inbox } from "lucide-react";
import EmptyState from "../empty";

export function DriverEmpty() {
  return (
    <EmptyState
      icon={<Inbox />}
      title="No Drivers Yet"
      description="You haven't created any driver yet. Get started by creating your first purchase driver."
      primaryAction={{
        label: "Create Driver",
        onClick: () => console.log("Create clicked"),
      }}
    />
  );
}
