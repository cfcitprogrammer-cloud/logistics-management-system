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

export default function DriverCard({ driver }: { driver: Driver }) {
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
    router.push(`/drivers/edit/${driver.ID}/`);
    // or open modal
  };

  const handleRemove = () => {
    console.log("Remove driver:", driver.ID);
    // open confirm dialog / call delete API
  };

  return (
    <Card>
      <CardHeader>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleRemove}
              >
                <Trash className="mr-2 h-4 w-4 text-destructive" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <header className="text-center space-y-2">
          <div className="mx-auto w-[100px] h-[100px]">
            {identicon && (
              <img src={identicon} alt="Identicon" className="rounded-full" />
            )}
          </div>

          <h2 className="text-xl font-semibold">{driver.NAME}</h2>

          <div className="flex justify-center gap-2">
            <Badge variant="outline">{driver.ID}</Badge>
            <Badge>{driver.STATUS}</Badge>
          </div>
        </header>

        <Separator />

        <div className="text-xs space-y-2">
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
