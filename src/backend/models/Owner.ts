import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { SoftwareProvider } from "./SoftwareProvider"

@Entity("owners")
export class Owner {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 255, nullable: true })
  companyLogo?: string

  @Column({ length: 255 })
  companyName!: string

  @Column({ unique: true })
  emailAddress!: string

  @Column({ length: 20, nullable: true })
  phoneNumber?: string

  @Column({ length: 255, nullable: true })
  website?: string

  @Column({ length: 100, nullable: true })
  businessType?: string

  @Column({ length: 100, nullable: true })
  country?: string

  @Column({ length: 255, nullable: true })
  streetAddress?: string

  @Column({ length: 100, nullable: true })
  city?: string

  @Column({ length: 100, nullable: true })
  stateProvince?: string

  @Column({ length: 20, nullable: true })
  zipPostalCode?: string

  @Column({ length: 100, nullable: true })
  subscriptionPlan?: string

  @Column({ length: 100, nullable: true })
  paymentMethod?: string

  @Column({ type: "text", nullable: true })
  additionalNotes?: string

  @Column({ default: true })
  isActive: boolean = true

  // Relationship to Software Provider
  @Column({ type: "uuid" })
  softwareProviderId!: string

  @ManyToOne(() => SoftwareProvider, { onDelete: "CASCADE" })
  @JoinColumn({ name: "softwareProviderId" })
  softwareProvider!: SoftwareProvider

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
} 