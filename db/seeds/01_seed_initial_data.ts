import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
// 1. Bersihkan data lama
await knex('users').del();
await knex('mahasiswa').del();
await knex('dosen').del();
await knex('pegawai').del();
await knex('jabatan').del();
await knex('jurusan').del();
await knex('fakultas').del();

// Reset AUTO_INCREMENT (MariaDB / MySQL)
await knex.raw('ALTER TABLE users AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE mahasiswa AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE dosen AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE pegawai AUTO_INCREMENT = 1;');

// 2. Insert Data Fakultas
await knex('fakultas').insert([
{ id: 1, kode_fakultas: 'FTI', nama_fakultas: 'Fakultas Teknologi Informasi' },
{ id: 2, kode_fakultas: 'FEB', nama_fakultas: 'Fakultas Ekonomi dan Bisnis' }
]);

// 3. Insert Data Jurusan
await knex('jurusan').insert([
{ id: 1, fakultas_id: 1, kode_jurusan: 'TI', nama_jurusan: 'Teknik Informatika', jenjang: 'S1' },
{ id: 2, fakultas_id: 2, kode_jurusan: 'AK', nama_jurusan: 'Akuntansi', jenjang: 'S1' }
]);

// 4. Insert Data Jabatan
await knex('jabatan').insert([
{ id: 1, nama_jabatan: 'Staff BAAK', keterangan: 'Pengelola Administrasi Akademik' },
{ id: 2, nama_jabatan: 'Staff Keuangan', keterangan: 'Pengelola Pembayaran Mahasiswa' }
]);

// 5. Insert Data Dosen (2 Dummy)
await knex('dosen').insert([
{
id: 1,
nidn: '0412058901',
nama_lengkap: 'Budi Santoso',
gelar_depan: 'Dr.',
gelar_belakang: 'M.Kom.',
jenis_kelamin: 'L',
email: 'budi.santoso@kampus.ac.id',
no_hp: '081234567890',
jurusan_id: 1
},
{
id: 2,
nidn: '0420108502',
nama_lengkap: 'Siti Rahmawati',
gelar_depan: 'Hj.',
gelar_belakang: 'M.Si.',
jenis_kelamin: 'P',
email: 'siti.rahmawati@kampus.ac.id',
no_hp: '081298765432',
jurusan_id: 2
}
]);

// 6. Insert Data Pegawai (2 Dummy)
await knex('pegawai').insert([
{
id: 1,
nip: '19900315202201',
nama_lengkap: 'Agus Pratama',
jenis_kelamin: 'L',
email: 'agus.pratama@kampus.ac.id',
no_hp: '085711223344',
jabatan_id: 1
},
{
id: 2,
nip: '19930820202302',
nama_lengkap: 'Dewi Lestari',
jenis_kelamin: 'P',
email: 'dewi.lestari@kampus.ac.id',
no_hp: '085755667788',
jabatan_id: 2
}
]);

// 7. Insert Data Mahasiswa (6 Dummy)
await knex('mahasiswa').insert([
{
id: 1,
nim: '2024001',
nama_lengkap: 'Andi Wijaya',
jenis_kelamin: 'L',
email: 'andi.wijaya@student.kampus.ac.id',
no_hp: '081311112222',
jurusan_id: 1,
angkatan: 2024,
status: 'aktif'
},
{
id: 2,
nim: '2024002',
nama_lengkap: 'Citra Kirana',
jenis_kelamin: 'P',
email: 'citra.kirana@student.kampus.ac.id',
no_hp: '081333334444',
jurusan_id: 1,
angkatan: 2024,
status: 'aktif'
},
{
id: 3,
nim: '2024003',
nama_lengkap: 'Eko Prasetyo',
jenis_kelamin: 'L',
email: 'eko.prasetyo@student.kampus.ac.id',
no_hp: '081355556666',
jurusan_id: 1,
angkatan: 2024,
status: 'aktif'
},
{
id: 4,
nim: '2024004',
nama_lengkap: 'Fina Nurlaila',
jenis_kelamin: 'P',
email: 'fina.nurlaila@student.kampus.ac.id',
no_hp: '081377778888',
jurusan_id: 2,
angkatan: 2024,
status: 'aktif'
},
{
id: 5,
nim: '2023001',
nama_lengkap: 'Gilang Ramadhan',
jenis_kelamin: 'L',
email: 'gilang.ramadhan@student.kampus.ac.id',
no_hp: '081399990000',
jurusan_id: 1,
angkatan: 2023,
status: 'aktif'
},
{
id: 6,
nim: '2023002',
nama_lengkap: 'Hany Kurnia',
jenis_kelamin: 'P',
email: 'hany.kurnia@student.kampus.ac.id',
no_hp: '081212123434',
jurusan_id: 2,
angkatan: 2023,
status: 'aktif'
}
]);

console.log('✅ Seed data dummy berhasil dimasukkan (10 Data Utama)!');
}