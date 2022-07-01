import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameGameMapTable1613643649133 implements MigrationInterface {
    name = 'RenameGameMapTable1613643649133'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE IF EXISTS public."gameMap" RENAME TO game_map`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT 0`);
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
        await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE IF EXISTS public."game_map" RENAME TO gameMap`);
    }

}
