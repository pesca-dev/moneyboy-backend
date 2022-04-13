import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1649857938992 implements MigrationInterface {
    name = "Migrations1649857938992";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`session\` (\`id\` varchar(255) NOT NULL, \`notificationToken\` varchar(255) NULL, \`createdAt\` bigint NOT NULL, \`userId\` varchar(255) NULL, UNIQUE INDEX \`IDX_ba49e7d24851680c5833c65d68\` (\`notificationToken\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`displayName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`emailVerified\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`payment\` (\`id\` varchar(255) NOT NULL, \`amount\` double NOT NULL, \`date\` bigint NOT NULL, \`fromId\` varchar(255) NULL, \`toId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_04d0b17bc3974d4068b15831fd1\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_ceca9f948aecebf0ae00f43b740\` FOREIGN KEY (\`toId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_ceca9f948aecebf0ae00f43b740\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_04d0b17bc3974d4068b15831fd1\``);
        await queryRunner.query(`ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_ba49e7d24851680c5833c65d68\` ON \`session\``);
        await queryRunner.query(`DROP TABLE \`session\``);
    }
}
