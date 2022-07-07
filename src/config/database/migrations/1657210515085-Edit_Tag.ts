import {MigrationInterface, QueryRunner} from "typeorm";

export class EditTag1657210515085 implements MigrationInterface {
    name = 'EditTag1657210515085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e"`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "ownerId" TO "authorId"`);
        await queryRunner.query(`COMMENT ON COLUMN "commented"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "commented"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comment"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comment"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_9e7e912c496407e930276dff88c" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_9e7e912c496407e930276dff88c"`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comment"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comment"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "commented"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "commented"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "authorId" TO "ownerId"`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
