"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface MigrationStatus {
  migrations: string[]
  pendingMigrations: number
  isInitialized: boolean
}

export default function MigrationsPage() {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkMigrationStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/migrations")
      const data = await response.json()
      
      if (data.success) {
        setMigrationStatus(data.data)
        toast.success("Migration status updated")
      } else {
        toast.error(data.error || "Failed to check migration status")
      }
    } catch (error) {
      toast.error("Error checking migration status")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const runMigrations = async () => {
    if (!confirm("Are you sure you want to run migrations? This will update your database schema.")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/migrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "run" }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Migrations completed successfully")
        checkMigrationStatus() // Refresh status
      } else {
        toast.error(data.error || "Failed to run migrations")
      }
    } catch (error) {
      toast.error("Error running migrations")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const revertLastMigration = async () => {
    if (!confirm("Are you sure you want to revert the last migration? This will undo the last database change.")) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/migrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "revert" }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Last migration reverted successfully")
        checkMigrationStatus() // Refresh status
      } else {
        toast.error(data.error || "Failed to revert migration")
      }
    } catch (error) {
      toast.error("Error reverting migration")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkMigrationStatus()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Database Migrations</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Migration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkMigrationStatus} disabled={loading}>
              Refresh Status
            </Button>
            <Button onClick={runMigrations} disabled={loading} variant="default">
              Run Migrations
            </Button>
            <Button onClick={revertLastMigration} disabled={loading} variant="destructive">
              Revert Last Migration
            </Button>
          </div>

          {migrationStatus && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{migrationStatus.migrations.length}</div>
                    <p className="text-xs text-muted-foreground">Applied Migrations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{migrationStatus.pendingMigrations}</div>
                    <p className="text-xs text-muted-foreground">Pending Migrations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {migrationStatus.isInitialized ? "✅" : "❌"}
                    </div>
                    <p className="text-xs text-muted-foreground">Database Connected</p>
                  </CardContent>
                </Card>
              </div>

              {migrationStatus.migrations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Applied Migrations:</h3>
                  <div className="space-y-1">
                    {migrationStatus.migrations.map((migration, index) => (
                      <div key={index} className="text-sm bg-gray-100 p-2 rounded">
                        {migration}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {migrationStatus.pendingMigrations > 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  <strong>Warning:</strong> You have {migrationStatus.pendingMigrations} pending migration(s).
                  Run migrations to update your database schema.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Migration Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Run migrations:</strong> <code className="bg-gray-100 px-2 py-1 rounded">npm run migration:run</code></p>
            <p><strong>Generate migration:</strong> <code className="bg-gray-100 px-2 py-1 rounded">npm run migration:generate MyMigrationName</code></p>
            <p><strong>Revert migration:</strong> <code className="bg-gray-100 px-2 py-1 rounded">npm run migration:revert</code></p>
            <p><strong>Show migrations:</strong> <code className="bg-gray-100 px-2 py-1 rounded">npm run migration:show</code></p>
            <p><strong>Development sync:</strong> <code className="bg-gray-100 px-2 py-1 rounded">npm run db:sync</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 