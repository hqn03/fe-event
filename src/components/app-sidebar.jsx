import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import { Group } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { useLocation, useParams } from "@tanstack/react-router";
import { IconDashboard } from "@tabler/icons-react";
import { IconListDetails } from "@tabler/icons-react";
import { IconChartBar } from "@tabler/icons-react";
import { IconFolder } from "@tabler/icons-react";
import { IconUsers } from "@tabler/icons-react";
import { useAuth } from "@/auth";

const adminNav = [
  {
    title: "Nguoi dung",
    url: "/admin/users",
    icon: Group,
  },
  {
    title: "Duyet su kien",
    url: "/admin/events",
    icon: CheckCircle,
  },
  {
    title: "Loại sự kiện",
    url: "/admin/event-types",
    icon: CheckCircle,
  },
];

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const location = useLocation();

  const managerNav = [
    {
      title: "Dashboard",
      url: "/manager/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Events",
      url: "/manager/events",
      icon: IconListDetails,
    },
    {
      title: "Orders",
      url: "/manager/orders",
      icon: IconListDetails,
    },
  ];
  const nav = location.pathname.startsWith("/manager") ? managerNav : adminNav;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">NHATEVENT</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={nav} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
