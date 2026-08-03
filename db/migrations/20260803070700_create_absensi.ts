import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('absensi', (table) => {
table.increments('id').primary();
table.integer('kelas_id').unsigned().notNullable()
.references('id').inTable('kelas').onDelete('CASCADE');
table.integer('mahasiswa_id').unsigned().notNullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.date('tanggal').notNullable();
table.integer('pertemuan_ke').unsigned().notNullable();
table.enum('status', ['hadir', 'izin', 'sakit', 'alpha']).defaultTo('alpha');
table.timestamps(true, true);

table.unique(['kelas_id', 'mahasiswa_id', 'pertemuan_ke']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('absensi');
}
