import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGameMap1610279826547 implements MigrationInterface {
    name = 'AddGameMap1610279826547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gameMap" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "steps" text array NOT NULL, CONSTRAINT "PK_ea202348769d4376d46fb5131b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`DROP TABLE "gameMap"`);
    }

}
