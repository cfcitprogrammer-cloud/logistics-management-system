import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function NewDeliveriesDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Delivery</DialogTitle>
          <DialogDescription>
            Make a new delivery based on existing purchase order.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
