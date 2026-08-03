import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.alterTable('mahasiswa', (table) => {
table.integer('dosen_pa_id').unsigned().nullable()
.references('id').inTable('dosen').onDelete('SET NULL')
.after('jurusan_id');
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.alterTable('mahasiswa', (table) => {
table.dropColumn('dosen_pa_id');
});
}
