"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconPackage,
  IconReceipt,
  IconBuilding,
  IconBriefcase,
  IconShoppingCart,
  IconUserCheck,
  IconChefHat,
  IconCode,
  IconCreditCard,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { SidebarThemeToggle } from "@/components/sidebar-theme-toggle";
import { AddInventoryModal } from "@/components/add-inventory-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Software Provider Portal",
      url: "/provider",
      icon: IconBuilding,
    },
    {
      title: "Owners",
      url: "/provider/owners",
      icon: IconUsers,
    },
    {
      title: "Subscriptions",
      url: "/provider/subscriptions",
      icon: IconCreditCard,
    },
    {
      title: "Payments",
      url: "/provider/payments",
      icon: IconReceipt,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: IconPackage,
    },
    {
      title: "Billing",
      url: "/billing",
      icon: IconReceipt,
    },
    {
      title: "Companies",
      url: "/companies",
      icon: IconBriefcase,
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: IconBuilding,
    },
    {
      title: "Purchases",
      url: "/purchases",
      icon: IconShoppingCart,
    },
    {
      title: "Supplier Payments",
      url: "/supplier-payments",
      icon: IconReceipt,
    },
    {
      title: "Sales Register",
      url: "/sales-register",
      icon: IconReport,
    },
    {
      title: "Staff Management",
      url: "/staff-management",
      icon: IconUsers,
    },
    {
      title: "Customer Management",
      url: "/customer-management",
      icon: IconUserCheck,
    },
    {
      title: "Restaurant Management",
      url: "/restaurant",
      icon: IconChefHat,
    },
    {
      title: "API Test",
      url: "/api-test",
      icon: IconCode,
    },
    {
      title: "System Users",
      url: "/system-users",
      icon: IconUsers,
    },
    {
      title: "Migrations",
      url: "/migrations",
      icon: IconDatabase,
    },
  ],
  navClouds: [
    // {
    //   title: "Capture",
    //   icon: IconCamera,
    //   isActive: true,
    //   url: "#",
    //   items: [
    //     {
    //       title: "Active Proposals",
    //       url: "#",
    //     },
    //     {
    //       title: "Archived",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Proposal",
    //   icon: IconFileDescription,
    //   url: "#",
    //   items: [
    //     {
    //       title: "Active Proposals",
    //       url: "#",
    //     },
    //     {
    //       title: "Archived",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Prompts",
    //   icon: IconFileAi,
    //   url: "#",
    //   items: [
    //     {
    //       title: "Active Proposals",
    //       url: "#",
    //     },
    //     {
    //       title: "Archived",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  documents: [
    // {
    //   name: "Data Library",
    //   url: "#",
    //   icon: IconDatabase,
    // },
    // {
    //   name: "Reports",
    //   url: "#",
    //   icon: IconReport,
    // },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const { userType } = useAuth();

  // Filter navigation items based on user type
  const getFilteredNavigation = () => {
    if (userType === 'softwareProvider') {
      // Software Provider sees: Software Provider Portal, Owners, Subscriptions, Payments, Owner Dashboard, Owner Stats
      return data.navMain.filter(item =>
        item.title === "Software Provider Portal" ||
        item.title === "Owners" ||
        item.title === "Subscriptions" ||
        item.title === "Payments"
      );
    } else if (userType === 'owner') {
      // Owner sees: Owner Dashboard, Owner Stats, System Users
      return data.navMain.filter(item => 
        item.title === "Owner Dashboard" || 
        item.title === "Owner Stats" || 
        item.title === "System Users"
      );
    } else {
      // Staff/Regular users see everything except Owner-specific pages, System Users, and Software Provider Portal
      return data.navMain.filter(item => 
        item.title !== "Owner Dashboard" && 
        item.title !== "Owner Stats" && 
        item.title !== "System Users" &&
        item.title !== "Software Provider Portal"
      );
    }
  };

  const filteredNavItems = getFilteredNavigation();

  const handleAddItem = (item: {
    name: string;
    sku: string;
    category: string;
    price: string;
    cost: string;
    stock: string;
    minStock: string;
    supplierId: string;
    location: string;
    description?: string;
  }) => {
    // Here you would typically add the item to your database
    console.log("Adding new item from sidebar:", item);
    setIsAddModalOpen(false);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">POS.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={filteredNavItems}
          onQuickCreate={userType !== 'owner' && userType !== 'softwareProvider' ? () => setIsAddModalOpen(true) : undefined}
        />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        {/* <SidebarThemeToggle /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      {/* Add Inventory Modal */}
      <AddInventoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddItem={handleAddItem}
      />
    </Sidebar>
  );
}
