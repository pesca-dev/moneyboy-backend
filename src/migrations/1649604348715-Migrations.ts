import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1649604348715 implements MigrationInterface {
    name = "Migrations1649604348715";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`session\` ADD UNIQUE INDEX \`IDX_ba49e7d24851680c5833c65d68\` (\`notificationToken\`)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`session\` DROP INDEX \`IDX_ba49e7d24851680c5833c65d68\``);
    }
}
