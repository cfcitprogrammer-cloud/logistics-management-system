import AllTabCard from "@/components/custom/drivers/all-tab-card";
import AsideCard from "@/components/custom/drivers/aside-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DriversPage() {
  return (
    <section className="grid grid-cols-3 gap-4">
      <Tabs defaultValue="all" className="col-span-2">
        <TabsList>
          <TabsTrigger value="all">All (12)</TabsTrigger>
          <TabsTrigger value="available">Available (9)</TabsTrigger>
          <TabsTrigger value="on-route">On Route (3)</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllTabCard />
        </TabsContent>
        <TabsContent value="available">Available TAB</TabsContent>
        <TabsContent value="on-route">On Route TAB</TabsContent>
      </Tabs>

      <AsideCard />
    </section>
  );
}
