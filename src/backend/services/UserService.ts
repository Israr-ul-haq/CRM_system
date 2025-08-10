import { Repository } from "typeorm"
import { getDatabase } from "../database"
import { User } from "../models/User"

export interface CreateUserData {
  name: string
  email: string
  phone?: string
  role?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  role?: string
  isActive?: boolean
}

export class UserService {
  private userRepository!: Repository<User>

  constructor() {
    this.initializeRepository()
  }

  private async initializeRepository() {
    const dataSource = await getDatabase()
    this.userRepository = dataSource.getRepository(User)
  }

  // Get all users with pagination and filters
  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    await this.initializeRepository()
    
    const queryBuilder = this.userRepository.createQueryBuilder("user")
    
    if (search) {
      queryBuilder.where(
        "user.name ILIKE :search OR user.email ILIKE :search",
        { search: `%${search}%` }
      )
    }
    
    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("user.createdAt", "DESC")
      .getManyAndCount()
    
    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    await this.initializeRepository()
    return await this.userRepository.findOne({ where: { id } })
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    await this.initializeRepository()
    return await this.userRepository.findOne({ where: { email } })
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    await this.initializeRepository()
    
    // Check if user with email already exists
    const existingUser = await this.getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }
    
    const user = this.userRepository.create(userData)
    return await this.userRepository.save(user)
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
    await this.initializeRepository()
    
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error("User not found")
    }
    
    // Check if email is being updated and if it already exists
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.getUserByEmail(userData.email)
      if (existingUser) {
        throw new Error("User with this email already exists")
      }
    }
    
    Object.assign(user, userData)
    return await this.userRepository.save(user)
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    await this.initializeRepository()
    
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error("User not found")
    }
    
    await this.userRepository.remove(user)
    return true
  }

  // Get users count
  async getUsersCount(): Promise<number> {
    await this.initializeRepository()
    return await this.userRepository.count()
  }

  // Get active users count
  async getActiveUsersCount(): Promise<number> {
    await this.initializeRepository()
    return await this.userRepository.count({ where: { isActive: true } })
  }
} 