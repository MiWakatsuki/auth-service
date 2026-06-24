import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableColumn } from 'typeorm/schema-builder/table/TableColumn';

export class AddRefreshTokenHashToUsers1718400000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users', 
            new TableColumn({
                name: 'refresh_token_hash',
                type: 'varchar',
                isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'refresh_token_hash');
    }
}