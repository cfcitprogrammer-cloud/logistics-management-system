import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TrackingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>#SH9283746</CardTitle>
        <CardDescription>Carrier Name</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={33} />
      </CardContent>
      <CardFooter>
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>More Details</AccordionTrigger>
            <AccordionContent>
              <h1>In Transit</h1>
              <p>Location A</p>
              <p>Time</p>

              <div>
                <p>Courier</p>
                <h2>John Doe</h2>

                <div className="flex gap-2">
                  <Button className="flex-1">Call</Button>
                  <Button className="flex-1">Email</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
