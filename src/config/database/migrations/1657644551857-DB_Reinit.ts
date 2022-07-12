import {MigrationInterface, QueryRunner} from "typeorm";

export class DBReinit1657644551857 implements MigrationInterface {
    name = 'DBReinit1657644551857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "username" character varying(20) NOT NULL DEFAULT '', "email" character varying(56) NOT NULL DEFAULT '', "password" character varying(200) NOT NULL DEFAULT '', "config" jsonb NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "content" character varying(400) NOT NULL DEFAULT '', "rating" integer NOT NULL DEFAULT '0', "parentId" character varying NOT NULL, "parentType" character varying NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "title" character varying(56) NOT NULL DEFAULT '', "isMeta" boolean NOT NULL DEFAULT false, "parentId" uuid, "authorId" uuid NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idea" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "title" character varying(56) NOT NULL DEFAULT '', "content" character varying(400) NOT NULL DEFAULT '', "rating" integer NOT NULL DEFAULT '0', "authorId" uuid NOT NULL, CONSTRAINT "PK_5096f543c484b349f5234da9d97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "title" character varying(56) NOT NULL DEFAULT '', "content" character varying(400) NOT NULL DEFAULT '', "rating" integer NOT NULL DEFAULT '0', "authorId" uuid NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parentId" uuid NOT NULL, "parentType" character varying NOT NULL, "tagId" uuid, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "tokenId" character varying(300) NOT NULL, "userId" character varying(300) NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb" FOREIGN KEY ("parentId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_9e7e912c496407e930276dff88c" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "idea" ADD CONSTRAINT "FK_67530863c810fc8fd60c3d59b4e" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_59d5801d406020527940335d902" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_12a0c5dcf89ed48c6c7b385a4be" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_12a0c5dcf89ed48c6c7b385a4be"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_59d5801d406020527940335d902"`);
        await queryRunner.query(`ALTER TABLE "idea" DROP CONSTRAINT "FK_67530863c810fc8fd60c3d59b4e"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_9e7e912c496407e930276dff88c"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_5f4effb7cd258ffa9ef554cfbbb"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "idea"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
