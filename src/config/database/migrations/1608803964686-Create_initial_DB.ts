import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInitialDB1608803964686 implements MigrationInterface {
    name = 'CreateInitialDB1608803964686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "tokenId" character varying(300) NOT NULL, "userId" character varying(300) NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "name" character varying(20) NOT NULL DEFAULT '', "email" character varying(56) NOT NULL DEFAULT '', "password" character varying(20) NOT NULL DEFAULT '', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "internalComment"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "item" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "item" ADD "internalComment" character varying(300)`);
        await queryRunner.query(`ALTER TABLE "item" ADD "lastChangedBy" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item" ADD "createdBy" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "item" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "item" ADD "isArchived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "item" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
