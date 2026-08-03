import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('nilai', (table) => {
table.increments('id').primary();
table.integer('mahasiswa_id').unsigned().notNullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.integer('kelas_id').unsigned().notNullable()
.references('id').inTable('kelas').onDelete('CASCADE');
table.decimal('nilai_tugas', 5, 2).nullable();
table.decimal('nilai_uts', 5, 2).nullable();
table.decimal('nilai_uas', 5, 2).nullable();
table.decimal('nilai_angka', 5, 2).nullable();
table.string('nilai_huruf', 2).nullable(); // A, AB, B, BC, C, D, E
table.decimal('bobot', 3, 2).nullable(); // 4.00, 3.50, dst — dipakai untuk hitung IP/IPK
table.timestamps(true, true);

table.unique(['mahasiswa_id', 'kelas_id']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('nilai');
}
