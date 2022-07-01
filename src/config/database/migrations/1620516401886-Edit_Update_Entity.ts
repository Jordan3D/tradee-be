import {MigrationInterface, QueryRunner} from "typeorm";

export class EditUpdateEntity1620516401886 implements MigrationInterface {
    name = 'EditUpdateEntity1620516401886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "file"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "file"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT 0`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "canBeUpgraded" SET DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "dateStart" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."dateStart" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "dateEnd" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."dateEnd" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "descriptions" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."descriptions" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."options" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "options" SET DEFAULT '{"language": "en", "volume": 100}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "options" SET DEFAULT '{"volume": 100, "language": "en"}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."options" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."descriptions" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "descriptions" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."dateEnd" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "dateEnd" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."dateStart" IS NULL`);
        await queryRunner.query(`ALTER TABLE "update" ALTER COLUMN "dateStart" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "update"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "canBeUpgraded" SET DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game_map"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "file"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "file"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
    }

}
