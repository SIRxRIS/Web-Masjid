"use client";

import * as React from "react";
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/laporan-keuangan/site-header";
import LaporanKeuanganClientComponent from "./LaporanKeuanganClientComponent";

export default function Page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <LaporanKeuanganClientComponent />
      </SidebarInset>
    </SidebarProvider>
  );
}