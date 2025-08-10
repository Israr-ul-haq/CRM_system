import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("software_providers")
export class SoftwareProvider {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 255 })
  name!: string

  @Column({ unique: true })
  email!: string

  @Column({ length: 255 })
  password!: string

  @Column({ length: 255 })
  techCompanyName!: string

  @Column({ default: true })
  isActive: boolean = true

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
} 