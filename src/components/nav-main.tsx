"use client"

import { IconCirclePlusFilled, IconPackage, type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onQuickCreate,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
  onQuickCreate?: () => void
}) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {onQuickCreate && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                onClick={onQuickCreate}
              >
                <IconCirclePlusFilled />
                <span>Quick Create</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconPackage />
                <span className="sr-only">Inventory</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            // Handle root path and exact matches
            const isActive = pathname === item.url || 
                           (item.url === "/dashboard" && pathname === "/") ||
                           (item.url !== "/dashboard" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className={isActive ? "!bg-black !text-white dark:!bg-white dark:!text-black font-medium shadow-sm" : ""}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
} 