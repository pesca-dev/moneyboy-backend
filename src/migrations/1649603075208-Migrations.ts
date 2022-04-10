import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1649603075208 implements MigrationInterface {
    name = "Migrations1649603075208";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` ADD \`notificationToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP COLUMN \`notificationToken\``);
    }
}
