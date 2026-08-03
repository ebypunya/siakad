import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('krs', (table) => {
table.increments('id').primary();
table.integer('mahasiswa_id').unsigned().notNullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.integer('tahun_akademik_id').unsigned().notNullable()
.references('id').inTable('tahun_akademik').onDelete('CASCADE');
table.enum('status', ['draft', 'diajukan', 'disetujui', 'ditolak']).defaultTo('draft');
table.timestamp('tanggal_pengajuan').nullable();
table.timestamp('tanggal_disetujui').nullable();
table.timestamps(true, true);

table.unique(['mahasiswa_id', 'tahun_akademik_id']);
});

await knex.schema.createTable('krs_detail', (table) => {
table.increments('id').primary();
table.integer('krs_id').unsigned().notNullable()
.references('id').inTable('krs').onDelete('CASCADE');
table.integer('kelas_id').unsigned().notNullable()
.references('id').inTable('kelas').onDelete('CASCADE');
table.timestamps(true, true);

table.unique(['krs_id', 'kelas_id']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('krs_detail');
await knex.schema.dropTableIfExists('krs');
}
