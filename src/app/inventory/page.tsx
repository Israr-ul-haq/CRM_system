"use client"

import { useState, useEffect } from "react"
import { InventoryTable } from "@/components/inventory-table"
import { InventorySearch } from "@/components/inventory-search"
import { SiteHeader } from "@/components/site-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { toast } from "sonner"

export default function InventoryPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for inventory data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const handleAddItem = (item: {
    name: string
    sku: string
    category: string
    price: string
    cost: string
    stock: string
    minStock: string
    supplierId: string
    location: string
    description?: string
  }) => {
    // Here you would typically add the item to your database
    console.log("Adding new item:", item)
    toast.success(`Added ${item.name} to inventory`)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 12)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" text="Loading inventory..." />
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                      <p className="text-muted-foreground">
                        Manage your product inventory and stock levels
                      </p>
                    </div>
                    <InventorySearch onAddItem={handleAddItem} />
                  </div>
                </div>
                <InventoryTable />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
} 