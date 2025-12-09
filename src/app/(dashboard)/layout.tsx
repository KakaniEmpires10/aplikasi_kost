import { SiteHeader } from "@/components/features/dashboard/main/site-header";
import TitlePage from "@/components/features/dashboard/TitlePage";
import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar"
import { Separator } from "@/components/ui/separator";
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
        <section className="@container/main flex flex-col gap-3 py-4 px-4 md:gap-4 md:py-6 lg:px-6">
          <TitlePage />
          <Separator />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout