import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGameEntity1609597791541 implements MigrationInterface {
    name = 'AddGameEntity1609597791541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying(20) NOT NULL DEFAULT 'game', "password" character varying(20) NOT NULL DEFAULT '', "phase" character varying(20) NOT NULL DEFAULT 'new', "players" jsonb, "settings" jsonb, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DROP TABLE "game"`);
    }

}
