"use client"

import { useState } from "react"
import { IconX, IconUser, IconMail, IconPhone, IconBriefcase, IconBuilding, IconClock, IconCurrencyDollar, IconCalendar } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const addStaffSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  branch: z.string().min(1, "Branch is required"),
  salary: z.string().min(1, "Salary is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { 
    message: "Salary must be a positive number" 
  }),
  shiftHours: z.string().min(1, "Shift hours are required"),
  joinDate: z.string().min(1, "Join date is required"),
  status: z.enum(["active", "inactive", "on_leave"]),
})

type AddStaffFormData = z.infer<typeof addStaffSchema>

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddStaffFormData) => Promise<void>
}

export function AddStaffModal({ isOpen, onClose, onSubmit }: AddStaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddStaffFormData>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      branch: "",
      salary: "",
      shiftHours: "",
      joinDate: "",
      status: "active",
    },
  })

  const handleSubmit = async (data: AddStaffFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      form.reset()
      onClose()
      toast.success("Staff member added successfully!")
    } catch (error) {
      toast.error("Failed to add staff member")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new staff member account.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID */}
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      Employee ID
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="EMP001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconMail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.smith@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1-555-0123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBriefcase className="h-4 w-4" />
                      Position
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                        <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                        <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                        <SelectItem value="Sweeper">Sweeper</SelectItem>
                        <SelectItem value="Security Guard">Security Guard</SelectItem>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Accountant">Accountant</SelectItem>
                        <SelectItem value="HR Manager">HR Manager</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      Department
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Branch */}
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      Branch
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Main Branch">Main Branch</SelectItem>
                        <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                        <SelectItem value="North Branch">North Branch</SelectItem>
                        <SelectItem value="South Branch">South Branch</SelectItem>
                        <SelectItem value="East Branch">East Branch</SelectItem>
                        <SelectItem value="West Branch">West Branch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary */}
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconCurrencyDollar className="h-4 w-4" />
                      Monthly Salary
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shift Hours */}
              <FormField
                control={form.control}
                name="shiftHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      Shift Hours
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift hours" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6:00 AM - 2:00 PM">6:00 AM - 2:00 PM</SelectItem>
                        <SelectItem value="7:00 AM - 3:00 PM">7:00 AM - 3:00 PM</SelectItem>
                        <SelectItem value="8:00 AM - 4:00 PM">8:00 AM - 4:00 PM</SelectItem>
                        <SelectItem value="8:30 AM - 4:30 PM">8:30 AM - 4:30 PM</SelectItem>
                        <SelectItem value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM</SelectItem>
                        <SelectItem value="9:00 AM - 6:00 PM">9:00 AM - 6:00 PM</SelectItem>
                        <SelectItem value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</SelectItem>
                        <SelectItem value="2:00 PM - 10:00 PM">2:00 PM - 10:00 PM</SelectItem>
                        <SelectItem value="3:00 PM - 11:00 PM">3:00 PM - 11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Join Date */}
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      Join Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Staff Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 