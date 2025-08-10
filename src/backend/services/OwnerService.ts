import { Repository } from "typeorm"
import { AppDataSource } from "../database"
import { Owner } from "../models/Owner"

export class OwnerService {
  private ownerRepository: Repository<Owner>

  constructor() {
    this.ownerRepository = AppDataSource.getRepository(Owner)
  }

  private async ensureInitialized() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, softwareProviderId?: string): Promise<{ owners: Owner[], total: number, totalPages: number }> {
    await this.ensureInitialized()
    const queryBuilder = this.ownerRepository.createQueryBuilder("owner")
      .leftJoinAndSelect("owner.softwareProvider", "softwareProvider")

    // Filter by software provider if provided
    if (softwareProviderId) {
      queryBuilder.andWhere("owner.softwareProviderId = :softwareProviderId", { softwareProviderId })
    }

    if (search) {
      queryBuilder.where(
        "(owner.companyName ILIKE :search OR owner.emailAddress ILIKE :search OR owner.phoneNumber ILIKE :search)",
        { search: `%${search}%` }
      )
    }

    const total = await queryBuilder.getCount()
    const totalPages = Math.ceil(total / limit)

    const owners = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("owner.createdAt", "DESC")
      .getMany()

    return { owners, total, totalPages }
  }

  async findById(id: string, softwareProviderId?: string): Promise<Owner | null> {
    await this.ensureInitialized()
    const queryBuilder = this.ownerRepository.createQueryBuilder("owner")
      .leftJoinAndSelect("owner.softwareProvider", "softwareProvider")
      .where("owner.id = :id", { id })

    if (softwareProviderId) {
      queryBuilder.andWhere("owner.softwareProviderId = :softwareProviderId", { softwareProviderId })
    }

    return await queryBuilder.getOne()
  }

  async findByEmail(email: string, softwareProviderId?: string): Promise<Owner | null> {
    await this.ensureInitialized()
    const queryBuilder = this.ownerRepository.createQueryBuilder("owner")
      .leftJoinAndSelect("owner.softwareProvider", "softwareProvider")
      .where("owner.emailAddress = :email", { email })

    if (softwareProviderId) {
      queryBuilder.andWhere("owner.softwareProviderId = :softwareProviderId", { softwareProviderId })
    }

    return await queryBuilder.getOne()
  }

  async create(ownerData: Partial<Owner>): Promise<Owner> {
    await this.ensureInitialized()
    
    // Ensure softwareProviderId is provided
    if (!ownerData.softwareProviderId) {
      throw new Error("softwareProviderId is required")
    }

    const owner = this.ownerRepository.create(ownerData)
    return await this.ownerRepository.save(owner)
  }

  async update(id: string, ownerData: Partial<Owner>, softwareProviderId?: string): Promise<Owner | null> {
    await this.ensureInitialized()
    
    // If softwareProviderId is provided, ensure the owner belongs to this provider
    if (softwareProviderId) {
      const existingOwner = await this.findById(id, softwareProviderId)
      if (!existingOwner) {
        throw new Error("Owner not found or access denied")
      }
    }

    await this.ownerRepository.update(id, ownerData)
    return await this.findById(id, softwareProviderId)
  }

  async delete(id: string, softwareProviderId?: string): Promise<boolean> {
    await this.ensureInitialized()
    
    // If softwareProviderId is provided, ensure the owner belongs to this provider
    if (softwareProviderId) {
      const existingOwner = await this.findById(id, softwareProviderId)
      if (!existingOwner) {
        throw new Error("Owner not found or access denied")
      }
    }

    const result = await this.ownerRepository.delete(id)
    return result.affected !== 0
  }

  async count(softwareProviderId?: string): Promise<number> {
    await this.ensureInitialized()
    const queryBuilder = this.ownerRepository.createQueryBuilder("owner")
    
    if (softwareProviderId) {
      queryBuilder.where("owner.softwareProviderId = :softwareProviderId", { softwareProviderId })
    }
    
    return await queryBuilder.getCount()
  }

  async countByStatus(isActive: boolean, softwareProviderId?: string): Promise<number> {
    await this.ensureInitialized()
    const queryBuilder = this.ownerRepository.createQueryBuilder("owner")
      .where("owner.isActive = :isActive", { isActive })
    
    if (softwareProviderId) {
      queryBuilder.andWhere("owner.softwareProviderId = :softwareProviderId", { softwareProviderId })
    }
    
    return await queryBuilder.getCount()
  }
} 