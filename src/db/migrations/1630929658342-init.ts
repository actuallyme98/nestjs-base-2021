import {MigrationInterface, QueryRunner} from "typeorm";

export class init1630929658342 implements MigrationInterface {
    name = 'init1630929658342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`base-nestjs\`.\`user\` (\`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`id\` char(36) NOT NULL, \`username\` varchar(60) NOT NULL, \`password\` varchar(60) NOT NULL, \`full_name\` varchar(180) NOT NULL, \`phone\` varchar(15) NULL, \`role\` enum ('super-admin', 'admin', 'employee', 'customer') NOT NULL DEFAULT 'admin', \`created_user_id\` char(36) NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`base-nestjs\`.\`user\` ADD CONSTRAINT \`FK_0d2de98ff32040eb01ce71478a6\` FOREIGN KEY (\`created_user_id\`) REFERENCES \`base-nestjs\`.\`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base-nestjs\`.\`user\` DROP FOREIGN KEY \`FK_0d2de98ff32040eb01ce71478a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`base-nestjs\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`base-nestjs\`.\`user\``);
    }

}
