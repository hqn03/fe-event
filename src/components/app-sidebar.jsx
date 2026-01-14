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
import { ChartColumn, File, LayoutDashboard, ScanIcon } from "lucide-react";
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
    title: "Duyệt sự kiện",
    url: "/admin/events",
    icon: CheckCircle,
  },
  {
    title: "Danh mục sự kiện",
    url: "/admin/event-types",
    icon: CheckCircle,
  },
  {
    title: "Báo cáo đặt vé",
    url: "/admin/orders",
    icon: ChartColumn,
  },
];

const managerNav = [
  {
    title: "Sự kiện",
    url: "/manager/events",
    icon: IconListDetails,
    children: [
      {
        title: "Thông tin sự kiện",
        url: "/manager/events/$eventId",
        search: { type: "edit" },
      },
      {
        title: "Phiên sự kiện",
        url: "/manager/events/$eventId",
        search: { type: "sessions" },
      },
      {
        title: "Vé",
        url: "/manager/events/$eventId",
        search: { type: "tickets" },
      },
      {
        title: "Sơ đồ ghế",
        url: "/manager/events/$eventId",
        search: { type: "seats" },
      },
      {
        title: "Thống kê",
        url: "/manager/events/$eventId",
        search: { type: "orders" },
      },
    ],
  },
  {
    title: "Quét vé",
    url: "/manager/ticket-scanner",
    icon: ScanIcon,
  },
  {
    title: "Lịch sử gửi duyệt",
    url: "/manager/events-approval",
    icon: File,
  },
];

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const location = useLocation();

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
