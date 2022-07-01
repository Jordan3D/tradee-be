import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFileEntityAndEditUserEntity1617803186438 implements MigrationInterface {
    name = 'AddFileEntityAndEditUserEntity1617803186438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "key" character varying(256) NOT NULL DEFAULT '', "url" character varying(256) NOT NULL DEFAULT '', CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(256) NOT NULL DEFAULT ''`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
