import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('pengajuan', (table) => {
table.increments('id').primary();
table.integer('mahasiswa_id').unsigned().notNullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.enum('jenis_pengajuan', [
'cuti_akademik',
'aktif_kembali',
'surat_keterangan',
'pindah_jurusan',
'lainnya',
]).notNullable();
table.text('deskripsi').nullable();
table.enum('status', ['diajukan', 'diproses', 'disetujui', 'ditolak']).defaultTo('diajukan');
table.text('catatan_admin').nullable();
table.timestamps(true, true);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('pengajuan');
}
