import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('mata_kuliah', (table) => {
table.increments('id').primary();
table.string('kode_mk', 15).notNullable().unique();
table.string('nama_mk', 150).notNullable();
table.integer('sks').unsigned().notNullable();

// nullable supaya mata kuliah universitas umum (agama, kewarganegaraan, dll)
// tidak wajib terikat ke satu jurusan saja
table.integer('jurusan_id').unsigned().nullable()
.references('id').inTable('jurusan').onDelete('SET NULL');

table.integer('semester_ke').unsigned().notNullable(); // posisi di kurikulum (1-8)
table.enum('jenis', ['wajib', 'pilihan']).defaultTo('wajib');
table.timestamps(true, true);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('mata_kuliah');
}
