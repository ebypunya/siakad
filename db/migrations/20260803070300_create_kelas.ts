import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('kelas', (table) => {
table.increments('id').primary();
table.integer('mata_kuliah_id').unsigned().notNullable()
.references('id').inTable('mata_kuliah').onDelete('CASCADE');
table.integer('dosen_id').unsigned().nullable()
.references('id').inTable('dosen').onDelete('SET NULL');
table.integer('tahun_akademik_id').unsigned().notNullable()
.references('id').inTable('tahun_akademik').onDelete('CASCADE');
table.string('nama_kelas', 5).notNullable(); // A, B, C
table.integer('kapasitas').unsigned().defaultTo(40);
table.string('ruangan', 30).nullable();
table.enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']).nullable();
table.time('jam_mulai').nullable();
table.time('jam_selesai').nullable();
table.timestamps(true, true);

table.unique(['mata_kuliah_id', 'tahun_akademik_id', 'nama_kelas']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('kelas');
}
