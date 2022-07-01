import {MigrationInterface, QueryRunner} from "typeorm";

export class AddItem1610276816287 implements MigrationInterface {
    name = 'AddItem1610276816287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying NOT NULL, "info" jsonb NOT NULL, "cost" character varying NOT NULL, "canBeOwned" boolean NOT NULL, "canBeMortgaged" boolean NOT NULL, "additional" jsonb NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
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
        await queryRunner.query(`COMMENT ON COLUMN "game"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "game"."createdAt" IS NULL`);
        await queryRunner.query(`DROP TABLE "item"`);
    }

}
