import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.alterTable('users', (table) => {
table.string('verification_token', 255).nullable().after('email');
table.timestamp('verification_token_expires').nullable().after('verification_token');
table.timestamp('email_verified_at').nullable().after('verification_token_expires');
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.alterTable('users', (table) => {
table.dropColumn('email_verified_at');
table.dropColumn('verification_token_expires');
table.dropColumn('verification_token');
});
}