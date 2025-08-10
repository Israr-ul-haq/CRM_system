import { 
  IconTrendingDown, 
  IconTrendingUp, 
  IconPackage, 
  IconReceipt, 
  IconUsers, 
  IconUserCheck,
  IconCurrencyDollar,
  IconShoppingCart,
  IconBuilding,
  IconCreditCard
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Sales & Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconReceipt className="h-4 w-4" />
            Total Sales Today
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $12,450.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="h-3 w-3" />
              +18.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Strong sales performance <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            45 transactions today
          </div>
        </CardFooter>
      </Card>

      {/* Inventory */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconPackage className="h-4 w-4" />
            Total Inventory Items
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,247
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-orange-600">
              <IconTrendingDown className="h-3 w-3" />
              12 Low Stock
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-orange-600">
            Low stock alerts <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $89,450 total inventory value
          </div>
        </CardFooter>
      </Card>

      {/* Customers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUserCheck className="h-4 w-4" />
            Active Customers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            156
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <IconTrendingUp className="h-3 w-3" />
              +8 New
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-blue-600">
            Growing customer base <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $45,200 total credit limit
          </div>
        </CardFooter>
      </Card>

      {/* Staff */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            Active Staff
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-purple-600">
              <IconTrendingUp className="h-3 w-3" />
              3 Checked In
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-purple-600">
            Good attendance today <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $125,000 total salary budget
          </div>
        </CardFooter>
      </Card>

      {/* Credit Usage */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4" />
            Customer Credit Used
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $18,750
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600">
              <IconTrendingUp className="h-3 w-3" />
              42% Used
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-red-600">
            Credit utilization high <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $26,450 available credit
          </div>
        </CardFooter>
      </Card>

      {/* Suppliers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconBuilding className="h-4 w-4" />
            Active Suppliers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            28
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="h-3 w-3" />
              +2 New
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Strong supplier network <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $67,800 outstanding payments
          </div>
        </CardFooter>
      </Card>

      {/* Transactions */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconShoppingCart className="h-4 w-4" />
            Today&apos;s Transactions
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-blue-600">
              <IconTrendingUp className="h-3 w-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-blue-600">
            Busy day at POS <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            32 cash, 8 credit, 5 staff credit
          </div>
        </CardFooter>
      </Card>

      {/* Profit Margin */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4" />
            Profit Margin
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            24.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="h-3 w-3" />
              +2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Improving profitability <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            $3,050 profit today
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
