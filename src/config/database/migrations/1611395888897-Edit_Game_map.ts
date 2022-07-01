import {MigrationInterface, QueryRunner} from "typeorm";

export class EditGameMap1611395888897 implements MigrationInterface {
    name = 'EditGameMap1611395888897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gameMap" DROP COLUMN "allItems"`);
        await queryRunner.query(`ALTER TABLE "gameMap" ADD "lotteries" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "gameMap" ADD "chances" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."updatedAt" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "gameMap"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "gameMap" DROP COLUMN "chances"`);
        await queryRunner.query(`ALTER TABLE "gameMap" DROP COLUMN "lotteries"`);
        await queryRunner.query(`ALTER TABLE "gameMap" ADD "allItems" text array NOT NULL DEFAULT '{}'`);
    }

}
