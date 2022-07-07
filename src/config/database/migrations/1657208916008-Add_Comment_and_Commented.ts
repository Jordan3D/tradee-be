import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCommentAndCommented1657208916008 implements MigrationInterface {
    name = 'AddCommentAndCommented1657208916008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "commented" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_cec9b9627ab756e720ea54d29b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "content" character varying(400) NOT NULL DEFAULT '', "rating" integer NOT NULL DEFAULT '0', "authorId" uuid NOT NULL, "parentId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e"`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."ownerId" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "commented"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "token"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."ownerId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tag"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_fe8fd04149d94c602f0c578d82e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "commented"`);
    }

}
