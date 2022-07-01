import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUpdateEntity1620505494092 implements MigrationInterface {
    name = 'AddUpdateEntity1620505494092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "update" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying(20) NOT NULL DEFAULT '', "dateStart" TIMESTAMP NOT NULL, "dateEnd" TIMESTAMP NOT NULL, "version" character varying NOT NULL, "descriptions" character varying NOT NULL, CONSTRAINT "PK_575f77a0576d6293bc1cb752847" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "item_group"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "file"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "file"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "admin"."createdAt" IS NULL`);
        await queryRunner.query(`DROP TABLE "update"`);
    }

}
