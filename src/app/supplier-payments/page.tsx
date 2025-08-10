"use client"

import { useState } from "react"
import { SupplierPaymentsTable } from "@/components/supplier-payments-table"
import { SupplierPaymentsSearch } from "@/components/supplier-payments-search"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { toast } from "sonner"

export default function SupplierPaymentsPage() {
  const handleAddPayment = (payment: {
    supplierId: string
    purchaseOrders: Array<{
      purchaseOrderId: string
      amount: number
    }>
    totalAmount: number
    paymentMethod: string
    paymentDate: string
    reference: string
    notes?: string
  }) => {
    console.log("Adding new payment:", payment)
    toast.success(`Payment of $${payment.totalAmount} added successfully for ${payment.purchaseOrders.length} purchase order(s)`)
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
                    <h1 className="text-2xl font-bold tracking-tight">Supplier Payments</h1>
                    <p className="text-muted-foreground">
                      Track payment history, credits, and debits for each supplier
                    </p>
                  </div>
                  <SupplierPaymentsSearch onAddPayment={handleAddPayment} />
                </div>
              </div>
              <SupplierPaymentsTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 