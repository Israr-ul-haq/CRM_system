import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateInitialTables1703123456789 implements MigrationInterface {
    name = 'CreateInitialTables1703123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "character varying",
                        length: "100",
                    },
                    {
                        name: "email",
                        type: "character varying",
                        isUnique: true,
                    },
                    {
                        name: "phone",
                        type: "character varying",
                        length: "20",
                        isNullable: true,
                    },
                    {
                        name: "role",
                        type: "character varying",
                        length: "100",
                        isNullable: true,
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        )

        // Create uuid-ossp extension if it doesn't exist
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }
} 