"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  LifeBuoy,
  Send,
  Settings2,
  Workflow,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const userData: { email: string; password: string } | unknown =
localStorage.getItem("user");

const data = {
  user: {
    name: "Jhon",
    email: userData?.email ?? "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Jobs",
      url: "#",
      icon: Workflow,
      isActive: true,
      items: [
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Applications",
          url: "#",
        },
        {
          title: "Saved",
          url: "#",
        },
      ],
    },
    {
      title: "Preparation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Resume Builder",
          url: "#",
        },
        {
          title: "Cover Letter",
          url: "#",
        },
        {
          title: "Test Prep",
          url: "#",
        },
        {
          title:  "Mock Interviews",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Filters",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
 }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
