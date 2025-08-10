"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconTable, IconClock } from "@tabler/icons-react"

interface Table {
  id?: string
  number: string
  capacity: number
  status: string
  currentOrder?: string | null
  reservation?: {
    time: string
    customerName: string
    partySize: number
    phone?: string
    notes?: string
  } | null
}

interface TableModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table?: Table | null
  onSave: (table: Table) => void
}

const tableStatuses = [
  { value: "available", label: "Available", color: "bg-green-100 text-green-800" },
  { value: "occupied", label: "Occupied", color: "bg-red-100 text-red-800" },
  { value: "reserved", label: "Reserved", color: "bg-yellow-100 text-yellow-800" },
  { value: "cleaning", label: "Cleaning", color: "bg-blue-100 text-blue-800" },
  { value: "out_of_service", label: "Out of Service", color: "bg-gray-100 text-gray-800" }
]

export default function TableModal({ open, onOpenChange, table, onSave }: TableModalProps) {
  const [formData, setFormData] = useState<Table>({
    number: "",
    capacity: 2,
    status: "available",
    currentOrder: null,
    reservation: null
  })
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationData, setReservationData] = useState({
    time: "",
    customerName: "",
    partySize: 2,
    phone: "",
    notes: ""
  })

  useEffect(() => {
    if (table) {
      setFormData(table)
      if (table.reservation) {
        setReservationData({
          time: table.reservation.time,
          customerName: table.reservation.customerName,
          partySize: table.reservation.partySize,
          phone: table.reservation.phone || "",
          notes: table.reservation.notes || ""
        })
        setShowReservationForm(true)
      }
    } else {
      setFormData({
        number: "",
        capacity: 2,
        status: "available",
        currentOrder: null,
        reservation: null
      })
      setReservationData({
        time: "",
        customerName: "",
        partySize: 2,
        phone: "",
        notes: ""
      })
      setShowReservationForm(false)
    }
  }, [table])

  const handleInputChange = (field: keyof Table, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReservationChange = (field: string, value: string | number) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleReservationForm = () => {
    setShowReservationForm(!showReservationForm)
    if (!showReservationForm) {
      // Set default time to current time + 1 hour
      const defaultTime = new Date()
      defaultTime.setHours(defaultTime.getHours() + 1)
      setReservationData(prev => ({
        ...prev,
        time: defaultTime.toISOString().slice(0, 16)
      }))
    } else {
      // Clear reservation data
      setReservationData({
        time: "",
        customerName: "",
        partySize: 2,
        phone: "",
        notes: ""
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tableData = {
      ...formData,
      reservation: showReservationForm && reservationData.customerName ? reservationData : null
    }
    
    onSave(tableData)
    onOpenChange(false)
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = tableStatuses.find(s => s.value === status)
    return (
      <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
        {statusInfo?.label || status}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconTable className="h-5 w-5" />
            {table ? "Edit Table" : "Add New Table"}
          </DialogTitle>
          <DialogDescription>
            {table ? "Update the table configuration" : "Configure a new table for your restaurant"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Table Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Table Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Table Number *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="e.g., A1, B2, 1, 2"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Select value={formData.capacity.toString()} onValueChange={(value) => handleInputChange('capacity', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 4, 6, 8, 10, 12].map((capacity) => (
                      <SelectItem key={capacity} value={capacity.toString()}>
                        {capacity} people
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Table Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reservation Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium border-b pb-2">Reservation</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleReservationForm}
              >
                {showReservationForm ? "Remove Reservation" : "Add Reservation"}
              </Button>
            </div>
            
            {showReservationForm && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reservationTime">Reservation Time *</Label>
                    <Input
                      id="reservationTime"
                      type="datetime-local"
                      value={reservationData.time}
                      onChange={(e) => handleReservationChange('time', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="partySize">Party Size *</Label>
                    <Select 
                      value={reservationData.partySize.toString()} 
                      onValueChange={(value) => handleReservationChange('partySize', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: formData.capacity }, (_, i) => i + 1).map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} people
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={reservationData.customerName}
                    onChange={(e) => handleReservationChange('customerName', e.target.value)}
                    placeholder="Customer's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={reservationData.phone}
                    onChange={(e) => handleReservationChange('phone', e.target.value)}
                    placeholder="Contact number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Special Notes</Label>
                  <Input
                    id="notes"
                    value={reservationData.notes}
                    onChange={(e) => handleReservationChange('notes', e.target.value)}
                    placeholder="Allergies, special requests, etc."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Status Display */}
          {table && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Current Status</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <div>{getStatusBadge(formData.status)}</div>
                </div>
                
                {formData.currentOrder && (
                  <div className="space-y-2">
                    <Label>Current Order</Label>
                    <div className="font-medium">Order #{formData.currentOrder}</div>
                  </div>
                )}
              </div>

              {formData.reservation && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <IconClock className="h-4 w-4" />
                    <span className="font-medium">Reserved</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Customer:</strong> {formData.reservation.customerName}</div>
                    <div><strong>Time:</strong> {new Date(formData.reservation.time).toLocaleString()}</div>
                    <div><strong>Party Size:</strong> {formData.reservation.partySize} people</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {table ? "Update Table" : "Add Table"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 