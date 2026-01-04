"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Truck } from "lucide-react";
import { generateIdenteapot } from "@teapotlabs/identeapots";
import { Driver } from "@/db/types/driver";
import { useEffect, useState } from "react";

export default function DriverCard({ driver }: { driver: Driver }) {
  const [identicon, setIdenticon] = useState<string>("");

  useEffect(() => {
    async function createIdenticon() {
      // simulate async generation, e.g., if future versions support promises
      const result = await Promise.resolve(
        generateIdenteapot(driver?.ID.toString(), "salt")
      );
      setIdenticon(result);
    }

    createIdenticon();
  }, [driver.ID]);

  return (
    <Card>
      <CardContent className="space-y-4">
        <header className="text-center space-y-2">
          <div className="mx-auto w-[100px] h-[100px]">
            {identicon ? (
              <img src={identicon} alt="Identicon" className="rounded-full" />
            ) : null}
          </div>
          <h2 className="text-xl font-semibold">{driver.NAME}</h2>
          <div className="flex justify-center gap-2">
            <Badge variant={"outline"}>{driver.ID}</Badge>
            <Badge variant={"default"}>{driver.STATUS}</Badge>
          </div>
        </header>

        <Separator />

        <div className="text-xs">
          <div className="flex justify-between items-center">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Phone size={12} /> Phone
            </p>
            <p>{driver.PHONE}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Mail size={12} /> Email
            </p>
            <p>{driver.EMAIL}</p>
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
