"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconFileDescription,
  IconSettings,
  IconUsers,
  IconArticle,
  IconReportAnalytics,
  IconChevronRight,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { NavDocuments } from "@/components/admin/layout/nav-documents";
import { NavMain } from "@/components/admin/layout/nav-main";
import { NavSecondary } from "@/components/admin/layout/nav-secondary";
import { NavUser } from "@/components/admin/layout/nav-user";
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
import { type NavMainItem } from "@/components/admin/layout/nav-main";

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
      icon: IconListDetails as React.ComponentType<any>,
      url: "#",
      chevronIcon: IconChevronRight as React.ComponentType<any>,
      children: [
        {
          title: "Daftar Pengurus",
          url: "/admin/main/management/daftar-pengurus",
          icon: IconUsersGroup as React.ComponentType<any>,
        },
        {
          title: "Tambah Pengurus",
          url: "/admin/main/management/tambah-pengurus",
          icon: IconUserPlus as React.ComponentType<any>,
        },
      ],
    },
    {
      title: "Konten",
      url: "/admin/main/content",
      icon: IconArticle,
    },
    {
      title: "Inventaris",
      url: "/admin/main/inventaris",
      icon: IconFolder,
    },
    {
      title: "Laporan Keuangan",
      url: "/admin/main/laporan-keuangan",
      icon: IconReportAnalytics,
    },
  ] as NavMainItem[],
  documents: [
    {
      name: "Panduan penggunaan",
      url: "/admin/main/panduan",
      icon: IconFileDescription,
    },
  ],
  /* navSecondary: [
    {
      title: "Pengaturan",
      url: "#",
      icon: IconSettings,
    },
  ],*/
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
                  src="/images/logo-masjid.png"
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
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
