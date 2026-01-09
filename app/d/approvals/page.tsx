"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AccountingApprovalTable from "@/components/custom/tables/AccountingApproval-table";
import { accountingApprovalColumns } from "@/components/custom/columns/accounting-approval-column";
import { PO } from "@/db/types/po";
import POView from "@/components/custom/po/po-view";
import axios from "axios";

export default function AccountingApprovalPage() {
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [selectedPOs, setSelectedPOs] = useState<PO[]>([]);

  const massApprove = async () => {
    const url = process.env.NEXT_PUBLIC_GAS_LINK || "";
    try {
      await Promise.all(
        selectedPOs.map((po) =>
          axios.post(
            url,
            JSON.stringify({
              action: "purchase-order",
              path: "accounting",
              id: po.ID,
              status: "APPROVED",
            })
          )
        )
      );
      alert("Mass approval completed!");
      setSelectedPOs([]);
    } catch (err) {
      console.error(err);
      alert("Mass approval failed");
    }
  };

  return (
    <div className="flex gap-4">
      <div className={selectedPO ? "w-2/3" : "w-full"}>
        <header className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold">Accounting Approval</h1>
          <Button onClick={massApprove} disabled={!selectedPOs.length}>
            Approve Selected
          </Button>
        </header>

        <AccountingApprovalTable
          columns={accountingApprovalColumns}
          onSelect={(row) => {
            if (!row) return;
            const exists = selectedPOs.find((p) => p.ID === row.ID);
            if (exists)
              setSelectedPOs(selectedPOs.filter((p) => p.ID !== row.ID));
            else setSelectedPOs([...selectedPOs, row]);
            setSelectedPO(row);
          }}
          renderActions={(row) => (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() =>
                  axios.post(
                    process.env.NEXT_PUBLIC_GAS_LINK || "",
                    JSON.stringify({
                      action: "purchase-order",
                      path: "accounting",
                      id: row.ID,
                      status: "APPROVED",
                    })
                  )
                }
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  axios.post(
                    process.env.NEXT_PUBLIC_GAS_LINK || "",
                    JSON.stringify({
                      action: "purchase-order",
                      path: "accounting",
                      id: row.ID,
                      status: "REJECTED",
                    })
                  )
                }
              >
                Reject
              </Button>
            </div>
          )}
        />
      </div>

      {selectedPO && <POView currentPO={selectedPO} />}
    </div>
  );
}
