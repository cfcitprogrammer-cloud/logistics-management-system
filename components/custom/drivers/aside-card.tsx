import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ellipsis } from "lucide-react";

export default function AsideCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
        <CardDescription>About the driver</CardDescription>
        <CardAction>
          <Button variant={"ghost"}>
            <Ellipsis />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
