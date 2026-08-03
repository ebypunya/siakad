import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('tahun_akademik', (table) => {
table.increments('id').primary();
table.string('tahun_ajaran', 9).notNullable(); // contoh: 2025/2026
table.enum('semester', ['ganjil', 'genap']).notNullable();
table.date('tanggal_mulai').notNullable();
table.date('tanggal_selesai').notNullable();
table.boolean('is_aktif').defaultTo(false);
table.timestamps(true, true);

table.unique(['tahun_ajaran', 'semester']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('tahun_akademik');
}
