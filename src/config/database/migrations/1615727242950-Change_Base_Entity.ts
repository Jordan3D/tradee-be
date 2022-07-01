import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeBaseEntity1615727242950 implements MigrationInterface {
  name = 'ChangeBaseEntity1615727242950';
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "game_map" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "game_map" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT 0`);
    await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "canBeUpgraded" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "item_group" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "item_group" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE TIMESTAMP`);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "token" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "item_group" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME`);
    await queryRunner.query(`ALTER TABLE "item_group" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "canBeUpgraded" SET DEFAULT false`);
    await queryRunner.query(`COMMENT ON COLUMN "item"."canBeUpgraded" IS NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "cost" SET DEFAULT '0'`);
    await queryRunner.query(`COMMENT ON COLUMN "item"."cost" IS NULL`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "item" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "game_map" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "game_map" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "createdAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE`);
  }
  
}
