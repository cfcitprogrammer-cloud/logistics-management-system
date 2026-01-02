import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DriverCard from "./driver-card";

export default function AllTabCard() {
  return (
    <Card>
      <CardHeader>
        <Input placeholder="Search drivers..." />

        <CardAction>
          <Button>Search</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid grid-cols-3">
        <DriverCard />
      </CardContent>
      <CardFooter>Show 9 of 20 results</CardFooter>
    </Card>
  );
}
