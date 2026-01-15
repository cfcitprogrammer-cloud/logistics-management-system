"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Mail, Phone, Truck, Pencil, Trash } from "lucide-react";

import { generateIdenteapot } from "@teapotlabs/identeapots";
import { Driver } from "@/db/types/driver";
import { useRouter } from "next/navigation";

export default function DriverCardAlt({ driver }: { driver: Driver }) {
  const [identicon, setIdenticon] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function createIdenticon() {
      const result = await Promise.resolve(
        generateIdenteapot(driver.ID.toString(), "26tyqgevwadguf")
      );
      setIdenticon(result);
    }

    createIdenticon();
  }, [driver.ID]);

  const handleEdit = () => {
    console.log("Edit driver:", driver.ID);
    router.push(`/d/drivers/edit/${driver.ID}/`);
    // or open modal
  };

  const handleRemove = () => {
    console.log("Remove driver:", driver.ID);
    // open confirm dialog / call delete API
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <header className="space-y-2 flex gap-3">
          <div className="w-[60px] h-[60px]">
            {identicon && (
              <img src={identicon} alt="Identicon" className="rounded-full" />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{driver.NAME}</h2>

            <div className="flex gap-2">
              <p>
                {driver.ID} | {driver.STATUS}
              </p>
            </div>
          </div>
        </header>

        <Separator />

        <div className="text-xs space-y-2">
          <div className="flex gap-2">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Phone size={12} /> Phone:
            </p>
            <p>{driver.PHONE}</p>
          </div>

          <div className="flex gap-2">
            <p className="flex items-center gap-1 text-gray-500 font-semibold">
              <Mail size={12} /> Email:
            </p>
            <p>{driver.EMAIL}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
