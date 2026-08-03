import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
await knex.schema.createTable('mata_kuliah_prasyarat', (table) => {
table.increments('id').primary();
table.integer('mata_kuliah_id').unsigned().notNullable()
.references('id').inTable('mata_kuliah').onDelete('CASCADE');
table.integer('prasyarat_id').unsigned().notNullable()
.references('id').inTable('mata_kuliah').onDelete('CASCADE');
table.timestamps(true, true);

table.unique(['mata_kuliah_id', 'prasyarat_id']);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('mata_kuliah_prasyarat');
}
