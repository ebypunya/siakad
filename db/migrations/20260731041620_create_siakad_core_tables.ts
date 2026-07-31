import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
// 1. Tabel Fakultas
await knex.schema.createTable('fakultas', (table) => {
table.increments('id').primary();
table.string('kode_fakultas', 10).notNullable().unique();
table.string('nama_fakultas', 100).notNullable();
table.timestamps(true, true);
});

// 2. Tabel Jurusan / Program Studi
await knex.schema.createTable('jurusan', (table) => {
table.increments('id').primary();
table.integer('fakultas_id').unsigned().notNullable()
.references('id').inTable('fakultas').onDelete('CASCADE');
table.string('kode_jurusan', 10).notNullable().unique();
table.string('nama_jurusan', 100).notNullable();
table.string('jenjang', 10).notNullable().defaultTo('S1'); // D3, S1, S2
table.timestamps(true, true);
});

// 3. Tabel Jabatan (Untuk Pegawai / Dosen)
await knex.schema.createTable('jabatan', (table) => {
table.increments('id').primary();
table.string('nama_jabatan', 50).notNullable().unique();
table.text('keterangan').nullable();
table.timestamps(true, true);
});

// 4. Tabel Data Diri Pegawai (Staf Non-Dosen)
await knex.schema.createTable('pegawai', (table) => {
table.increments('id').primary();
table.string('nip', 20).notNullable().unique();
table.string('nama_lengkap', 100).notNullable();
table.enum('jenis_kelamin', ['L', 'P']).notNullable();
table.string('email', 100).notNullable().unique();
table.string('no_hp', 20).nullable();
table.integer('jabatan_id').unsigned().nullable()
.references('id').inTable('jabatan').onDelete('SET NULL');
table.timestamps(true, true);
});

// 5. Tabel Data Diri Dosen
await knex.schema.createTable('dosen', (table) => {
table.increments('id').primary();
table.string('nidn', 20).notNullable().unique(); // Nomor Induk Dosen Nasional / NIP
table.string('nama_lengkap', 100).notNullable();
table.string('gelar_depan', 20).nullable();
table.string('gelar_belakang', 30).nullable();
table.enum('jenis_kelamin', ['L', 'P']).notNullable();
table.string('email', 100).notNullable().unique();
table.string('no_hp', 20).nullable();
table.integer('jurusan_id').unsigned().nullable()
.references('id').inTable('jurusan').onDelete('SET NULL');
table.timestamps(true, true);
});

// 6. Tabel Data Diri Mahasiswa
await knex.schema.createTable('mahasiswa', (table) => {
table.increments('id').primary();
table.string('nim', 20).notNullable().unique();
table.string('nama_lengkap', 100).notNullable();
table.enum('jenis_kelamin', ['L', 'P']).notNullable();
table.string('email', 100).notNullable().unique();
table.string('no_hp', 20).nullable();
table.integer('jurusan_id').unsigned().notNullable()
.references('id').inTable('jurusan').onDelete('RESTRICT');
table.integer('angkatan', 4).notNullable();
table.enum('status', ['aktif', 'cuti', 'lulus', 'drop_out']).defaultTo('aktif');
table.timestamps(true, true);
});

// 7. Tabel Users (Untuk Autentikasi / Login)
await knex.schema.createTable('users', (table) => {
table.increments('id').primary();
table.string('nomor_induk', 20).notNullable().unique(); // Isinya: NIM / NIDN / NIP
table.string('username', 50).notNullable().unique();
table.string('password_hash', 255).notNullable();
table.enum('role', ['mahasiswa', 'dosen', 'pegawai', 'admin']).notNullable();

// Foreign Key opsional yang merujuk ke ID profil masing-masing
table.integer('mahasiswa_id').unsigned().nullable()
.references('id').inTable('mahasiswa').onDelete('CASCADE');
table.integer('dosen_id').unsigned().nullable()
.references('id').inTable('dosen').onDelete('CASCADE');
table.integer('pegawai_id').unsigned().nullable()
.references('id').inTable('pegawai').onDelete('CASCADE');

table.boolean('is_active').defaultTo(true);
table.timestamps(true, true);
});
}

export async function down(knex: Knex): Promise<void> {
await knex.schema.dropTableIfExists('users');
await knex.schema.dropTableIfExists('mahasiswa');
await knex.schema.dropTableIfExists('dosen');
await knex.schema.dropTableIfExists('pegawai');
await knex.schema.dropTableIfExists('jabatan');
await knex.schema.dropTableIfExists('jurusan');
await knex.schema.dropTableIfExists('fakultas');
}