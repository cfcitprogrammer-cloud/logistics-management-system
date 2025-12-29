import Stat from "@/components/custom/stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClockFading,
  Ellipsis,
  Package,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";

export default function ShipmentsPage() {
  return (
    <section className="space-y-4">
      <header className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <Stat title="Total Shipments" icon={Truck} value="1,300" />
        <Stat title="Pending" icon={ClockFading} value="100" />
        <Stat title="Delivery" icon={Package} value="1,000" />
        <Stat title="Completed" icon={PackageCheck} value="100" />
      </header>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center gap-2">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
          </TabsList>

          <InputGroup className="w-50 ml-auto">
            <InputGroupInput placeholder="Search Shipment ID" />
            <InputGroupAddon align="inline-start">
              <Search className="w-5 h-5 text-gray-500" />
            </InputGroupAddon>
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"}>Card View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>List View</DropdownMenuItem>
              <DropdownMenuItem>Card View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>New Shipment</Button>
        </div>

        <TabsContent
          value="all"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        >
          {/* card view sample */}
          <Card>
            <CardHeader>
              <CardTitle>#SH9283746</CardTitle>
              <CardDescription>
                <Badge>In Transit</Badge>
              </CardDescription>

              <CardAction>
                <Button variant={"ghost"}>
                  <Ellipsis />
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-2">
              <Separator className="mb-5" />

              <div>
                <h1 className="text-sm font-semibold">TechGear Inc.</h1>
                <p className="text-sm">hihsd</p>
              </div>

              <div className="bg-gray-300 p-2 space-y-2 rounded">
                <div className="flex justify-between items-start text-sm">
                  <p>Origin</p>

                  <div>
                    <h2 className="font-semibold">Manila, PH</h2>
                    <p>June 15, 2023 - 12:00 PM</p>
                  </div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <p>Destination</p>

                  <div>
                    <h2 className="font-semibold">Manila, PH</h2>
                    <p>June 15, 2023 - 12:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <p>
                  <strong>Progress:</strong> 60%
                </p>
                <p>
                  <strong>Carrier:</strong> FedEx
                </p>
              </div>
              <Progress value={60} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
