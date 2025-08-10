import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 100 })
  name!: string

  @Column({ unique: true })
  email!: string

  @Column({ length: 20, nullable: true })
  phone?: string

  @Column({ length: 100, nullable: true })
  role?: string

  @Column({ default: true })
  isActive: boolean = true

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
} 