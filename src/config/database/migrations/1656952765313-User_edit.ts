import {MigrationInterface, QueryRunner} from "typeorm";

export class UserEdit1656952765313 implements MigrationInterface {
    name = 'UserEdit1656952765313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "config" jsonb NOT NULL`);
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
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "config"`);
    }

}
