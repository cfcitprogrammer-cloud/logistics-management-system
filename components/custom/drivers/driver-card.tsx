import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Truck } from "lucide-react";

export default function DriverCard() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <header className="text-center space-y-2">
          <h2 className="text-xl font-semibold">John Doe</h2>
          <div className="flex justify-center gap-2">
            <Badge variant={"outline"}>DVR001</Badge>
            <Badge variant={"default"}>Available</Badge>
          </div>
        </header>
        <Separator />
        <div className="text-xs">
          <div className="flex justify-between items-center">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Phone size={12} /> Phone
            </p>
            <p>123-456-7890</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Mail size={12} /> Email
            </p>
            <p>johndoe@example.com</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-xs bg-accent p-2 rounded-lg w-full flex gap-2 items-center">
          <div className="p-1 bg-primary text-primary-foreground rounded-lg">
            <Truck size={22} />
          </div>
          <div>
            <h3>Cargo Van - White</h3>
            <p>CA 390 456</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
