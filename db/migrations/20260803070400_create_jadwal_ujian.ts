import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('jadwal_ujian', (table) => {
table.increments('id').primary();
table.integer('kelas_id').unsigned().notNullable()
.references('id').inTable('kelas').onDelete('CASCADE');
table.enum('jenis_ujian', ['UTS', 'UAS']).notNullable();
table.date('tanggal').notNullable();
table.time('jam_mulai').notNullable();
table.time('jam_selesai').notNullable();
table.string('ruangan', 30).nullable();
table.timestamps(true, true);

table.unique(['kelas_id', 'jenis_ujian']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('jadwal_ujian');
}
