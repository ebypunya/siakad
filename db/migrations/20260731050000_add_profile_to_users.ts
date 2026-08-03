import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.alterTable('users', (table) => {
table.string('nama_lengkap', 100).nullable().after('username');
table.string('email', 100).nullable().unique().after('nama_lengkap');
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.alterTable('users', (table) => {
table.dropColumn('email');
table.dropColumn('nama_lengkap');
});
}