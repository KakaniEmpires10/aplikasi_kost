import { SiteHeader } from "@/components/features/dashboard/main/site-header";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
}

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="@container/main flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout