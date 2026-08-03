import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'Siakad123!';

export async function seed(knex: Knex): Promise<void> {
// 1. Bersihkan data lama (urutan mengikuti relasi foreign key)
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
await knex.raw('ALTER TABLE jurusan AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE jabatan AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE fakultas AUTO_INCREMENT = 1;');

const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
const verifiedNow = knex.fn.now(); // akun seed langsung dianggap terverifikasi, tidak perlu klik email

// 2. Fakultas (4)
await knex('fakultas').insert([
{ id: 1, kode_fakultas: 'FTI', nama_fakultas: 'Fakultas Teknologi Informasi' },
{ id: 2, kode_fakultas: 'FEB', nama_fakultas: 'Fakultas Ekonomi dan Bisnis' },
{ id: 3, kode_fakultas: 'FH', nama_fakultas: 'Fakultas Hukum' },
{ id: 4, kode_fakultas: 'FKIP', nama_fakultas: 'Fakultas Keguruan dan Ilmu Pendidikan' },
]);

// 3. Jurusan / Program Studi (6)
await knex('jurusan').insert([
{ id: 1, fakultas_id: 1, kode_jurusan: 'TI', nama_jurusan: 'Teknik Informatika', jenjang: 'S1' },
{ id: 2, fakultas_id: 1, kode_jurusan: 'SI', nama_jurusan: 'Sistem Informasi', jenjang: 'S1' },
{ id: 3, fakultas_id: 2, kode_jurusan: 'AK', nama_jurusan: 'Akuntansi', jenjang: 'S1' },
{ id: 4, fakultas_id: 2, kode_jurusan: 'MJ', nama_jurusan: 'Manajemen', jenjang: 'S1' },
{ id: 5, fakultas_id: 3, kode_jurusan: 'IH', nama_jurusan: 'Ilmu Hukum', jenjang: 'S1' },
{ id: 6, fakultas_id: 4, kode_jurusan: 'PGSD', nama_jurusan: 'Pendidikan Guru Sekolah Dasar', jenjang: 'S1' },
]);

// 4. Jabatan (untuk Pegawai)
await knex('jabatan').insert([
{ id: 1, nama_jabatan: 'Staff BAAK', keterangan: 'Pengelola Administrasi Akademik' },
{ id: 2, nama_jabatan: 'Staff Keuangan', keterangan: 'Pengelola Pembayaran Mahasiswa' },
{ id: 3, nama_jabatan: 'Staff Perpustakaan', keterangan: 'Pengelola Layanan Perpustakaan' },
{ id: 4, nama_jabatan: 'Kepala Tata Usaha', keterangan: 'Koordinator Administrasi Umum' },
]);

// 5. Dosen (6)
await knex('dosen').insert([
{
id: 1, nidn: '0412058901', nama_lengkap: 'Budi Santoso',
gelar_depan: 'Dr.', gelar_belakang: 'M.Kom.', jenis_kelamin: 'L',
email: 'budi.santoso@kampus.ac.id', no_hp: '081234567890', jurusan_id: 1,
},
{
id: 2, nidn: '0420108502', nama_lengkap: 'Siti Rahmawati',
gelar_depan: 'Hj.', gelar_belakang: 'M.Si.', jenis_kelamin: 'P',
email: 'siti.rahmawati@kampus.ac.id', no_hp: '081298765432', jurusan_id: 3,
},
{
id: 3, nidn: '0405117603', nama_lengkap: 'Ahmad Fauzi',
gelar_depan: null, gelar_belakang: 'M.T.', jenis_kelamin: 'L',
email: 'ahmad.fauzi@kampus.ac.id', no_hp: '081345678901', jurusan_id: 1,
},
{
id: 4, nidn: '0411068804', nama_lengkap: 'Rina Kartika',
gelar_depan: null, gelar_belakang: 'M.Kom.', jenis_kelamin: 'P',
email: 'rina.kartika@kampus.ac.id', no_hp: '081356789012', jurusan_id: 2,
},
{
id: 5, nidn: '0418127705', nama_lengkap: 'Hendra Wijaya',
gelar_depan: 'Dr.', gelar_belakang: 'S.H., M.H.', jenis_kelamin: 'L',
email: 'hendra.wijaya@kampus.ac.id', no_hp: '081367890123', jurusan_id: 5,
},
{
id: 6, nidn: '0429039106', nama_lengkap: 'Dewi Anggraini',
gelar_depan: null, gelar_belakang: 'M.Pd.', jenis_kelamin: 'P',
email: 'dewi.anggraini@kampus.ac.id', no_hp: '081378901234', jurusan_id: 6,
},
]);

// 6. Pegawai / Staff (4)
await knex('pegawai').insert([
{
id: 1, nip: '19900315202201', nama_lengkap: 'Agus Pratama', jenis_kelamin: 'L',
email: 'agus.pratama@kampus.ac.id', no_hp: '085711223344', jabatan_id: 1,
},
{
id: 2, nip: '19930820202302', nama_lengkap: 'Dewi Lestari', jenis_kelamin: 'P',
email: 'dewi.lestari@kampus.ac.id', no_hp: '085755667788', jabatan_id: 2,
},
{
id: 3, nip: '19880604201801', nama_lengkap: 'Fajar Nugroho', jenis_kelamin: 'L',
email: 'fajar.nugroho@kampus.ac.id', no_hp: '085799887766', jabatan_id: 3,
},
{
id: 4, nip: '19910127201902', nama_lengkap: 'Maya Puspita', jenis_kelamin: 'P',
email: 'maya.puspita@kampus.ac.id', no_hp: '085712349876', jabatan_id: 4,
},
]);

// 7. Mahasiswa (18) — bervariasi jurusan, angkatan, dan status
await knex('mahasiswa').insert([
{ id: 1, nim: '2024001', nama_lengkap: 'Andi Wijaya', jenis_kelamin: 'L', email: 'andi.wijaya@student.kampus.ac.id', no_hp: '081311112222', jurusan_id: 1, angkatan: 2024, status: 'aktif' },
{ id: 2, nim: '2024002', nama_lengkap: 'Citra Kirana', jenis_kelamin: 'P', email: 'citra.kirana@student.kampus.ac.id', no_hp: '081333334444', jurusan_id: 1, angkatan: 2024, status: 'aktif' },
{ id: 3, nim: '2024003', nama_lengkap: 'Eko Prasetyo', jenis_kelamin: 'L', email: 'eko.prasetyo@student.kampus.ac.id', no_hp: '081355556666', jurusan_id: 2, angkatan: 2024, status: 'aktif' },
{ id: 4, nim: '2024004', nama_lengkap: 'Fina Nurlaila', jenis_kelamin: 'P', email: 'fina.nurlaila@student.kampus.ac.id', no_hp: '081377778888', jurusan_id: 3, angkatan: 2024, status: 'aktif' },
{ id: 5, nim: '2024005', nama_lengkap: 'Galih Saputra', jenis_kelamin: 'L', email: 'galih.saputra@student.kampus.ac.id', no_hp: '081388991122', jurusan_id: 4, angkatan: 2024, status: 'aktif' },
{ id: 6, nim: '2024006', nama_lengkap: 'Hani Kusuma', jenis_kelamin: 'P', email: 'hani.kusuma@student.kampus.ac.id', no_hp: '081399002233', jurusan_id: 5, angkatan: 2024, status: 'aktif' },
{ id: 7, nim: '2023001', nama_lengkap: 'Gilang Ramadhan', jenis_kelamin: 'L', email: 'gilang.ramadhan@student.kampus.ac.id', no_hp: '081399990000', jurusan_id: 1, angkatan: 2023, status: 'aktif' },
{ id: 8, nim: '2023002', nama_lengkap: 'Hany Kurnia', jenis_kelamin: 'P', email: 'hany.kurnia@student.kampus.ac.id', no_hp: '081212123434', jurusan_id: 2, angkatan: 2023, status: 'aktif' },
{ id: 9, nim: '2023003', nama_lengkap: 'Irfan Maulana', jenis_kelamin: 'L', email: 'irfan.maulana@student.kampus.ac.id', no_hp: '081211001122', jurusan_id: 3, angkatan: 2023, status: 'aktif' },
{ id: 10, nim: '2023004', nama_lengkap: 'Julia Permata', jenis_kelamin: 'P', email: 'julia.permata@student.kampus.ac.id', no_hp: '081211223344', jurusan_id: 6, angkatan: 2023, status: 'cuti' },
{ id: 11, nim: '2022001', nama_lengkap: 'Krisna Aditya', jenis_kelamin: 'L', email: 'krisna.aditya@student.kampus.ac.id', no_hp: '081522334455', jurusan_id: 1, angkatan: 2022, status: 'aktif' },
{ id: 12, nim: '2022002', nama_lengkap: 'Laila Fitriani', jenis_kelamin: 'P', email: 'laila.fitriani@student.kampus.ac.id', no_hp: '081533445566', jurusan_id: 4, angkatan: 2022, status: 'aktif' },
{ id: 13, nim: '2022003', nama_lengkap: 'Muhammad Rizki', jenis_kelamin: 'L', email: 'm.rizki@student.kampus.ac.id', no_hp: '081544556677', jurusan_id: 5, angkatan: 2022, status: 'aktif' },
{ id: 14, nim: '2022004', nama_lengkap: 'Nadia Salsabila', jenis_kelamin: 'P', email: 'nadia.salsabila@student.kampus.ac.id', no_hp: '081555667788', jurusan_id: 2, angkatan: 2022, status: 'aktif' },
{ id: 15, nim: '2021001', nama_lengkap: 'Oscar Pratama', jenis_kelamin: 'L', email: 'oscar.pratama@student.kampus.ac.id', no_hp: '081655778899', jurusan_id: 1, angkatan: 2021, status: 'lulus' },
{ id: 16, nim: '2021002', nama_lengkap: 'Putri Ayunda', jenis_kelamin: 'P', email: 'putri.ayunda@student.kampus.ac.id', no_hp: '081666889900', jurusan_id: 3, angkatan: 2021, status: 'lulus' },
{ id: 17, nim: '2021003', nama_lengkap: 'Qori Ramadhani', jenis_kelamin: 'L', email: 'qori.ramadhani@student.kampus.ac.id', no_hp: '081677990011', jurusan_id: 6, angkatan: 2021, status: 'aktif' },
{ id: 18, nim: '2021004', nama_lengkap: 'Ratna Sari', jenis_kelamin: 'P', email: 'ratna.sari@student.kampus.ac.id', no_hp: '081688001122', jurusan_id: 4, angkatan: 2021, status: 'drop_out' },
]);

// 8. Users — akun login untuk semua role
//    Password default SEMUA akun di bawah: Siakad123!
await knex('users').insert([
// --- Admin ---
{
id: 1, nomor_induk: 'ADM001', username: 'admin',
nama_lengkap: 'Administrator SIAKAD', email: 'admin@ukcorelabs.ac.id',
password_hash: passwordHash, role: 'admin', is_active: true,
email_verified_at: verifiedNow,
},

// --- Dosen (6 akun, mengikuti data dosen di atas) ---
{ id: 2, nomor_induk: '0412058901', username: '0412058901', nama_lengkap: 'Budi Santoso', email: 'budi.santoso@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 1, is_active: true, email_verified_at: verifiedNow },
{ id: 3, nomor_induk: '0420108502', username: '0420108502', nama_lengkap: 'Siti Rahmawati', email: 'siti.rahmawati@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 2, is_active: true, email_verified_at: verifiedNow },
{ id: 4, nomor_induk: '0405117603', username: '0405117603', nama_lengkap: 'Ahmad Fauzi', email: 'ahmad.fauzi@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 3, is_active: true, email_verified_at: verifiedNow },
{ id: 5, nomor_induk: '0411068804', username: '0411068804', nama_lengkap: 'Rina Kartika', email: 'rina.kartika@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 4, is_active: true, email_verified_at: verifiedNow },
{ id: 6, nomor_induk: '0418127705', username: '0418127705', nama_lengkap: 'Hendra Wijaya', email: 'hendra.wijaya@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 5, is_active: true, email_verified_at: verifiedNow },
{ id: 7, nomor_induk: '0429039106', username: '0429039106', nama_lengkap: 'Dewi Anggraini', email: 'dewi.anggraini@kampus.ac.id', password_hash: passwordHash, role: 'dosen', dosen_id: 6, is_active: true, email_verified_at: verifiedNow },

// --- Pegawai (4 akun) ---
{ id: 8, nomor_induk: '19900315202201', username: '19900315202201', nama_lengkap: 'Agus Pratama', email: 'agus.pratama@kampus.ac.id', password_hash: passwordHash, role: 'pegawai', pegawai_id: 1, is_active: true, email_verified_at: verifiedNow },
{ id: 9, nomor_induk: '19930820202302', username: '19930820202302', nama_lengkap: 'Dewi Lestari', email: 'dewi.lestari@kampus.ac.id', password_hash: passwordHash, role: 'pegawai', pegawai_id: 2, is_active: true, email_verified_at: verifiedNow },
{ id: 10, nomor_induk: '19880604201801', username: '19880604201801', nama_lengkap: 'Fajar Nugroho', email: 'fajar.nugroho@kampus.ac.id', password_hash: passwordHash, role: 'pegawai', pegawai_id: 3, is_active: true, email_verified_at: verifiedNow },
{ id: 11, nomor_induk: '19910127201902', username: '19910127201902', nama_lengkap: 'Maya Puspita', email: 'maya.puspita@kampus.ac.id', password_hash: passwordHash, role: 'pegawai', pegawai_id: 4, is_active: true, email_verified_at: verifiedNow },

// --- Mahasiswa (8 akun contoh, sisanya sengaja belum punya login
//     supaya kamu juga bisa test alur register untuk mahasiswa baru) ---
{ id: 12, nomor_induk: '2024001', username: '2024001', nama_lengkap: 'Andi Wijaya', email: 'andi.wijaya@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 1, is_active: true, email_verified_at: verifiedNow },
{ id: 13, nomor_induk: '2024002', username: '2024002', nama_lengkap: 'Citra Kirana', email: 'citra.kirana@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 2, is_active: true, email_verified_at: verifiedNow },
{ id: 14, nomor_induk: '2023001', username: '2023001', nama_lengkap: 'Gilang Ramadhan', email: 'gilang.ramadhan@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 7, is_active: true, email_verified_at: verifiedNow },
{ id: 15, nomor_induk: '2023002', username: '2023002', nama_lengkap: 'Hany Kurnia', email: 'hany.kurnia@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 8, is_active: true, email_verified_at: verifiedNow },
{ id: 16, nomor_induk: '2022001', username: '2022001', nama_lengkap: 'Krisna Aditya', email: 'krisna.aditya@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 11, is_active: true, email_verified_at: verifiedNow },
{ id: 17, nomor_induk: '2022002', username: '2022002', nama_lengkap: 'Laila Fitriani', email: 'laila.fitriani@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 12, is_active: true, email_verified_at: verifiedNow },
{ id: 18, nomor_induk: '2021001', username: '2021001', nama_lengkap: 'Oscar Pratama', email: 'oscar.pratama@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 15, is_active: true, email_verified_at: verifiedNow },
{ id: 19, nomor_induk: '2021003', username: '2021003', nama_lengkap: 'Qori Ramadhani', email: 'qori.ramadhani@student.kampus.ac.id', password_hash: passwordHash, role: 'mahasiswa', mahasiswa_id: 17, is_active: true, email_verified_at: verifiedNow },
]);

console.log('✅ Seed lengkap berhasil dimasukkan:');
console.log('   4 fakultas, 6 jurusan, 4 jabatan, 6 dosen, 4 pegawai, 18 mahasiswa, 19 akun login');
console.log(`   Password semua akun dummy: ${DEFAULT_PASSWORD}`);
}