"use client"

import { useState } from "react"
import { CompaniesTable } from "@/components/companies-table"
import { CompaniesSearch } from "@/components/companies-search"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { toast } from "sonner"

export default function CompaniesPage() {
  const handleAddCompany = (company: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    industry: string
    size: string
    status: string
    notes?: string
  }) => {
    // Here you would typically add the company to your database
    console.log("Adding new company:", company)
    toast.success(`Added ${company.name} to companies`)
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
                    <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
                    <p className="text-muted-foreground">
                      Manage your business relationships and company information
                    </p>
                  </div>
                  <CompaniesSearch onAddCompany={handleAddCompany} />
                </div>
              </div>
              <CompaniesTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 