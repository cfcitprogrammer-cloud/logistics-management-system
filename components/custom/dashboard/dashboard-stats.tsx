import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Shipment</CardDescription>
          <CardTitle className="text-2xl">7,391</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Delivery</CardDescription>
          <CardTitle className="text-2xl">5,698</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Completed</CardDescription>
          <CardTitle className="text-2xl">121</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Return</CardDescription>
          <CardTitle className="text-2xl">391</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
