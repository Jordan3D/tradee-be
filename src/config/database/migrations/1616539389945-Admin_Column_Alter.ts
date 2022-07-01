import {MigrationInterface, QueryRunner} from "typeorm";

export class AdminColumnAlter1616539389945 implements MigrationInterface {
    name = 'AdminColumnAlter1616539389945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ALTER COLUMN "password" TYPE character varying(200)`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "admin" ALTER COLUMN "password" TYPE character varying(20)`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
    }

}
