"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  CarFront,
  CheckCircle,
  Database,
  FileText,
  IdCard,
  LayoutDashboard,
  Presentation,
  ReceiptText,
  Route,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { NavMain } from "./navs/nav-main";
import { NavUser } from "./navs/nav-user";
import { NavSecondary } from "./navs/nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/d/dashboard",
      icon: LayoutDashboard,
    },
  ],

  navOrders: [
    {
      title: "Purchase Orders",
      url: "/d/purchase-orders",
      icon: FileText,
    },
    // {
    //   title: "Approvals",
    //   url: "/d/approvals",
    //   icon: CheckCircle,
    // },
  ],

  navOperations: [
    // {
    //   title: "Calendar",
    //   url: "/d/calendar",
    //   icon: Calendar,
    // },
    {
      title: "Shipments",
      url: "/d/shipments",
      icon: Truck,
    },
    {
      title: "Tracking",
      url: "/d/tracking",
      icon: Route,
    },
  ],

  navAssets: [
    // {
    //   title: "Warehouse",
    //   url: "/d/warehouse",
    //   icon: Warehouse,
    // },
    {
      title: "Fleet",
      url: "/d/fleet",
      icon: CarFront,
    },
    {
      title: "Drivers",
      url: "/d/drivers",
      icon: IdCard,
    },
  ],

  navFinance: [
    {
      title: "Invoices and Billing",
      url: "/d/invoices",
      icon: ReceiptText,
    },
  ],
  navSecondary: [
    {
      title: "System Database",
      url: "/d/system-database",
      icon: Database,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <span className="text-base font-semibold">
                  Logistics Management System
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        {/* Orders & Approvals */}
        <NavSecondary items={data.navOrders} title="Orders & Approvals" />

        {/* Operations */}
        <NavSecondary items={data.navOperations} title="Operations" />

        {/* Assets & Resources */}
        <NavSecondary items={data.navAssets} title="Assets & Resources" />

        {/* Finance */}
        {/* <NavSecondary items={data.navFinance} title="Finance" /> */}

        {/* Secondary / Utility */}
        {/* <NavSecondary items={data.navSecondary} title="System" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
