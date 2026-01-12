"use client";

import { useEffect, useState } from "react";
import { LogOut, EllipsisVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { generateIdenteapot } from "@teapotlabs/identeapots";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<User | null>(null);
  const [identicon, setIdenticon] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (user != null) {
      async function createIdenticon() {
        // simulate async generation, e.g., if future versions support promises
        const result = await Promise.resolve(
          generateIdenteapot(user?.email!, "26tyqgevwadguf")
        );
        setIdenticon(result);
      }

      createIdenticon();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return null; // optionally show a spinner here

  // map Firebase user to NavUser props
  const userProps = {
    name: user.displayName || "Anonymous",
    email: user.email || "",
    avatar: user.photoURL || "",
  };

  async function logOut() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      alert("Something went wrong");
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={identicon} alt={userProps.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userProps.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userProps.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={identicon} alt={userProps.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userProps.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userProps.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
