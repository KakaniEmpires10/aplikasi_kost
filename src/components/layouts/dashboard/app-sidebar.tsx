"use client"

import * as React from "react"

// import { NavDocuments } from "@/components/layouts/dashboard/nav-documents"
import { NavMain } from "@/components/layouts/dashboard/nav-main"
import { NavSecondary } from "@/components/layouts/dashboard/nav-secondary"
import { NavUser } from "@/components/layouts/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { IconInnerShadowTop } from "@tabler/icons-react"
import { listDashboardNav } from "../list-nav"
import { NavMaster } from "./nav-master"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data:session, isPending } = authClient.useSession();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={listDashboardNav.navMain} />
        <NavMaster items={listDashboardNav.navMaster} />
        {/* <NavDocuments items={listDashboardNav.documents} /> */}
        <NavSecondary items={listDashboardNav.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {isPending ? "loading..." : <NavUser user={session?.user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
