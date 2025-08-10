"use client"

import { useState } from "react"
import { PurchasesTable } from "@/components/purchases-table"
import { PurchasesSearch } from "@/components/purchases-search"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { toast } from "sonner"

export default function PurchasesPage() {
  const handleAddPurchase = (purchase: {
    supplierId: string
    companyId: string
    items: Array<{
      inventoryId: string
      quantity: number
      unitCost: number
    }>
    totalAmount: number
    paymentStatus: string
    paymentMethod: string
    checkDate?: string
    partialAmount?: number
    expectedDelivery: string
    notes?: string
  }) => {
    // Here you would typically add the purchase to your database
    console.log("Adding new purchase:", purchase)
    toast.success(`Purchase order created successfully`)
  }

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Purchases</h1>
                    <p className="text-muted-foreground">
                      Manage stock purchases and supplier payments
                    </p>
                  </div>
                  <PurchasesSearch onAddPurchase={handleAddPurchase} />
                </div>
              </div>
              <PurchasesTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 