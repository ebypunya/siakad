import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('tagihan', (table) => {
table.increments('id').primary();
table.integer('mahasiswa_id').unsigned().notNullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.integer('tahun_akademik_id').unsigned().notNullable()
.references('id').inTable('tahun_akademik').onDelete('CASCADE');
table.string('jenis_tagihan', 50).notNullable(); // UKT, SPP, dll
table.decimal('jumlah', 12, 2).notNullable();
table.date('jatuh_tempo').notNullable();
table.enum('status', ['belum_bayar', 'sebagian', 'lunas']).defaultTo('belum_bayar');
table.timestamps(true, true);
});

await knex.schema.createTable('pembayaran', (table) => {
table.increments('id').primary();
table.integer('tagihan_id').unsigned().notNullable()
.references('id').inTable('tagihan').onDelete('CASCADE');
table.decimal('jumlah_bayar', 12, 2).notNullable();
table.string('metode', 30).nullable(); // transfer, virtual_account, dll
table.string('bukti_bayar', 255).nullable();
table.timestamp('tanggal_bayar').defaultTo(knex.fn.now());
table.timestamps(true, true);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('pembayaran');
await knex.schema.dropTableIfExists('tagihan');
}
