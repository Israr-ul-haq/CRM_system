"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  IconSearch, 
  IconPlus, 
  IconRefresh,
  IconDownload
} from "@tabler/icons-react"

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: Record<string, unknown>[]
  searchPlaceholder?: string
  searchKeys?: string[]
  onAdd?: () => void
  onRefresh?: () => void
  onExport?: () => void
  isLoading?: boolean
  className?: string
}

export function DataTable({
  title,
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKeys = [],
  onAdd,
  onRefresh,
  onExport,
  isLoading = false,
  className
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const filteredAndSortedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchQuery && searchKeys.length > 0) {
      filtered = data.filter(item =>
        searchKeys.some(key =>
          String(item[key])
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        // Convert to comparable values
        const aComparable = typeof aVal === 'string' ? aVal.toLowerCase() : 
                           typeof aVal === 'number' ? aVal : 
                           typeof aVal === 'boolean' ? (aVal ? 1 : 0) : 
                           String(aVal || '')
        
        const bComparable = typeof bVal === 'string' ? bVal.toLowerCase() : 
                           typeof bVal === 'number' ? bVal : 
                           typeof bVal === 'boolean' ? (bVal ? 1 : 0) : 
                           String(bVal || '')

        if (aComparable < bComparable) return sortConfig.direction === 'asc' ? -1 : 1
        if (aComparable > bComparable) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchQuery, searchKeys, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return null
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={isLoading}
              >
                <IconDownload className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onAdd && (
              <Button size="sm" onClick={onAdd}>
                <IconPlus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${
                        column.sortable ? 'cursor-pointer hover:bg-muted' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : filteredAndSortedData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedData.map((row, index) => (
                    <tr
                      key={(row.id as string) || index}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-sm">
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key] || '')}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedData.length} of {data.length} results
        </div>
      </CardContent>
    </Card>
  )
} 