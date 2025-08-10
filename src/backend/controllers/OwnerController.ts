import { NextRequest, NextResponse } from "next/server"
import { OwnerService } from "../services/OwnerService"

export class OwnerController {
  private ownerService: OwnerService

  constructor() {
    this.ownerService = new OwnerService()
  }

  async getAllOwners(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || undefined
    const softwareProviderId = searchParams.get("softwareProviderId") || undefined

    try {
      const result = await this.ownerService.findAll(page, limit, search, softwareProviderId)
      return NextResponse.json({
        success: true,
        data: result
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch owners"
      }, { status: 500 })
    }
  }

  async getOwnerById(id: string, softwareProviderId?: string) {
    try {
      const owner = await this.ownerService.findById(id, softwareProviderId)
      if (!owner) {
        return NextResponse.json({
          success: false,
          error: "Owner not found"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: owner
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch owner"
      }, { status: 500 })
    }
  }

  async createOwner(request: NextRequest) {
    try {
      const body = await request.json()
      
      // Validate required fields
      if (!body.companyName || !body.emailAddress) {
        return NextResponse.json({
          success: false,
          error: "Company name and email address are required"
        }, { status: 400 })
      }

      // Check if email already exists
      const existingOwner = await this.ownerService.findByEmail(body.emailAddress)
      if (existingOwner) {
        return NextResponse.json({
          success: false,
          error: "An owner with this email address already exists"
        }, { status: 409 })
      }

      const owner = await this.ownerService.create(body)
      return NextResponse.json({
        success: true,
        message: "Owner created successfully",
        data: owner
      }, { status: 201 })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create owner"
      }, { status: 500 })
    }
  }

  async updateOwner(id: string, request: NextRequest, softwareProviderId?: string) {
    try {
      const body = await request.json()
      
      // Check if email is being updated and if it already exists
      if (body.emailAddress) {
        const existingOwner = await this.ownerService.findByEmail(body.emailAddress, softwareProviderId)
        if (existingOwner && existingOwner.id !== id) {
          return NextResponse.json({
            success: false,
            error: "An owner with this email address already exists"
          }, { status: 409 })
        }
      }

      const owner = await this.ownerService.update(id, body, softwareProviderId)
      if (!owner) {
        return NextResponse.json({
          success: false,
          error: "Owner not found or access denied"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: "Owner updated successfully",
        data: owner
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to update owner"
      }, { status: 500 })
    }
  }

  async deleteOwner(id: string, softwareProviderId?: string) {
    try {
      const success = await this.ownerService.delete(id, softwareProviderId)
      if (!success) {
        return NextResponse.json({
          success: false,
          error: "Owner not found or access denied"
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: "Owner deleted successfully"
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete owner"
      }, { status: 500 })
    }
  }

  async getOwnerStats(softwareProviderId?: string) {
    try {
      const totalOwners = await this.ownerService.count(softwareProviderId)
      const activeOwners = await this.ownerService.countByStatus(true, softwareProviderId)
      const inactiveOwners = await this.ownerService.countByStatus(false, softwareProviderId)

      return NextResponse.json({
        success: true,
        data: {
          totalOwners,
          activeOwners,
          inactiveOwners,
          conversionRate: totalOwners > 0 ? ((activeOwners / totalOwners) * 100).toFixed(2) : "0"
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch owner stats"
      }, { status: 500 })
    }
  }
} 