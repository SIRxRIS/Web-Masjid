"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconFileDescription,
  IconSettings,
  IconUsers,
  IconArticle,
  IconReportAnalytics,
  IconChevronRight,  
} from "@tabler/icons-react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { NavDocuments } from "@/components/layout/admin/nav-documents";
import { NavMain } from "@/components/layout/admin/nav-main";
import { NavSecondary } from "@/components/layout/admin/nav-secondary";
import { NavUser } from "@/components/layout/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

type IconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  [key: string]: any;
}>;

interface NavItem {
  title: string;
  url: string;
  icon: IconComponent;
}
import { type NavMainItem } from "@/components/layout/admin/nav-main";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/main/dashboard",
      icon: IconDashboard as React.ComponentType<any>,
    },
    {
      title: "Keuangan",
      icon: IconChartBar as React.ComponentType<any>,
      url: "#",
      chevronIcon: IconChevronRight as React.ComponentType<any>,
      children: [
        {
          title: "Pemasukan",
          url: "/admin/main/finance/pemasukan",
          icon: ArrowDownCircle as React.ComponentType<any>,
        },
        {
          title: "Pengeluaran",
          url: "/admin/main/finance/pengeluaran",
          icon: ArrowUpCircle as React.ComponentType<any>,
        },
      ],
    },
    {
      title: "Manajemen",
      url: "/admin/main/management",
      icon: IconListDetails,
    },
    {
      title: "Konten",
      url: "#",
      icon: IconArticle,
    },
    {
      title: "Inventaris",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Kegiatan",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Laporan Keuangan",
      url: "#",
      icon: IconReportAnalytics,
    },
  ] as NavMainItem[],
  documents: [
    {
      name: "Panduan penggunaan",
      url: "#",
      icon: IconFileDescription,
    },
    {
      name: "FAQ",
      url: "#",
      icon: IconHelp,
    },
    {
      name: "Kontak support",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
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
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Image
                  src="/logo-masjid.png"
                  alt="Masjid Logo"
                  width={38}
                  height={38}
                  className="object-contain"
                />
                <span className="text-base font-semibold">
                  Masjid Jawahiruzzarqa
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
