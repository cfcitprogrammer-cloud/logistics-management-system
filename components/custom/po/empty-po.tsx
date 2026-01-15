import { Inbox } from "lucide-react";
import EmptyState from "../empty";

export function POEmpty() {
  return (
    <EmptyState
      icon={<Inbox />}
      title="No Purchase Orders Yet"
      description="You haven't created any purchase order yet. Get started by creating your first purchase order."
      primaryAction={{
        label: "Create Purchase Order",
        onClick: () => console.log("Create clicked"),
      }}
    />
  );
}
