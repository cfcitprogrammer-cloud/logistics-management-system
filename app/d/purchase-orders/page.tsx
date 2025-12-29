import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function PurchaseOrdersPage() {
  return (
    <section>
      <div className="flex gap-4">
        <div className="w-2/3 p-4 rounded-xl bg-white shadow-sm">
          <header className="flex justify-between items-center gap-4">
            <h1 className="text-sm font-semibold">Purchase Orders</h1>

            <div className="flex gap-4">
              <Input />
              <Link href={"purchase-orders/new"}>
                <Button>New PO</Button>
              </Link>
            </div>
          </header>
        </div>

        <aside className="w-1/3">
          <h1>Invoice Details</h1>
        </aside>
      </div>
    </section>
  );
}
