import {MigrationInterface, QueryRunner} from "typeorm";

export class EditGameMap1610448202348 implements MigrationInterface {
    name = 'EditGameMap1610448202348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gameMap" ADD "allItems" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."steps" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gameMap" ALTER COLUMN "steps" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "item"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gameMap" ALTER COLUMN "steps" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."steps" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gameMap" DROP COLUMN "allItems"`);
    }

}
