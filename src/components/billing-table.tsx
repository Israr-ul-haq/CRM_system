"use client"

import { IconTrash, IconMinus, IconPlus, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

interface BillingTableProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onResetCart?: () => void
}

export function BillingTable({ items, onUpdateQuantity, onRemoveItem, onResetCart }: BillingTableProps) {
  const handleQuantityChange = (id: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0
    onUpdateQuantity(id, quantity)
  }

  const incrementQuantity = (id: number, currentQuantity: number) => {
    onUpdateQuantity(id, currentQuantity + 1)
  }

  const decrementQuantity = (id: number, currentQuantity: number) => {
    onUpdateQuantity(id, currentQuantity - 1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cart Items ({items.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>
          {items.length > 0 && onResetCart && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetCart}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <IconRefresh className="h-4 w-4" />
              Reset Cart (F3)
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center w-[150px]">Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No items in cart. Scan a barcode or search for products to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => decrementQuantity(item.id, item.quantity)}
                            className="h-8 w-8 p-0"
                          >
                            <IconMinus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => incrementQuantity(item.id, item.quantity)}
                            className="h-8 w-8 p-0"
                          >
                            <IconPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 