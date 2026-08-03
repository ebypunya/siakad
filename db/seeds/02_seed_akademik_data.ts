import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
// 0. Bersihkan data lama (urutan mengikuti relasi foreign key, dari anak ke induk)
await knex('pembayaran').del();
await knex('tagihan').del();
await knex('pengajuan').del();
await knex('absensi').del();
await knex('nilai').del();
await knex('krs_detail').del();
await knex('krs').del();
await knex('jadwal_ujian').del();
await knex('kelas').del();
await knex('mata_kuliah_prasyarat').del();
await knex('mata_kuliah').del();
await knex('tahun_akademik').del();

// Reset AUTO_INCREMENT (MariaDB / MySQL)
await knex.raw('ALTER TABLE pembayaran AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE tagihan AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE pengajuan AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE absensi AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE nilai AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE krs_detail AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE krs AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE jadwal_ujian AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE kelas AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE mata_kuliah_prasyarat AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE mata_kuliah AUTO_INCREMENT = 1;');
await knex.raw('ALTER TABLE tahun_akademik AUTO_INCREMENT = 1;');

// 1. Tahun Akademik (3) — id 3 (2025/2026 ganjil) jadi tahun aktif berjalan
await knex('tahun_akademik').insert([
{ id: 1, tahun_ajaran: '2024/2025', semester: 'ganjil', tanggal_mulai: '2024-09-01', tanggal_selesai: '2025-01-31', is_aktif: false },
{ id: 2, tahun_ajaran: '2024/2025', semester: 'genap', tanggal_mulai: '2025-02-01', tanggal_selesai: '2025-06-30', is_aktif: false },
{ id: 3, tahun_ajaran: '2025/2026', semester: 'ganjil', tanggal_mulai: '2025-09-01', tanggal_selesai: '2026-01-31', is_aktif: true },
]);

// 2. Mata Kuliah (9) — mengikuti jurusan_id dari seed 01 (1=TI, 2=SI)
await knex('mata_kuliah').insert([
{ id: 1, kode_mk: 'TIF101', nama_mk: 'Algoritma dan Pemrograman', sks: 3, jurusan_id: 1, semester_ke: 1, jenis: 'wajib' },
{ id: 2, kode_mk: 'TIF102', nama_mk: 'Struktur Data', sks: 3, jurusan_id: 1, semester_ke: 2, jenis: 'wajib' },
{ id: 3, kode_mk: 'TIF103', nama_mk: 'Basis Data', sks: 3, jurusan_id: 1, semester_ke: 2, jenis: 'wajib' },
{ id: 4, kode_mk: 'TIF104', nama_mk: 'Pemrograman Web', sks: 3, jurusan_id: 1, semester_ke: 3, jenis: 'wajib' },
{ id: 5, kode_mk: 'SIF101', nama_mk: 'Pengantar Sistem Informasi', sks: 3, jurusan_id: 2, semester_ke: 1, jenis: 'wajib' },
{ id: 6, kode_mk: 'SIF102', nama_mk: 'Analisis & Perancangan Sistem', sks: 3, jurusan_id: 2, semester_ke: 2, jenis: 'wajib' },
{ id: 7, kode_mk: 'UNV101', nama_mk: 'Pendidikan Agama', sks: 2, jurusan_id: null, semester_ke: 1, jenis: 'wajib' },
{ id: 8, kode_mk: 'UNV102', nama_mk: 'Pendidikan Kewarganegaraan', sks: 2, jurusan_id: null, semester_ke: 1, jenis: 'wajib' },
{ id: 9, kode_mk: 'UNV103', nama_mk: 'Bahasa Inggris', sks: 2, jurusan_id: null, semester_ke: 2, jenis: 'wajib' },
]);

// 3. Prasyarat Mata Kuliah
await knex('mata_kuliah_prasyarat').insert([
{ mata_kuliah_id: 2, prasyarat_id: 1 }, // Struktur Data butuh Algoritma dan Pemrograman
{ mata_kuliah_id: 4, prasyarat_id: 3 }, // Pemrograman Web butuh Basis Data
{ mata_kuliah_id: 6, prasyarat_id: 5 }, // Analisis & Perancangan Sistem butuh Pengantar SI
]);

// 4. Kelas (5) — semua dibuka di tahun akademik aktif (id 3)
await knex('kelas').insert([
{ id: 1, mata_kuliah_id: 1, dosen_id: 3, tahun_akademik_id: 3, nama_kelas: 'A', kapasitas: 40, ruangan: 'Lab TI 1', hari: 'senin', jam_mulai: '08:00', jam_selesai: '10:30' },
{ id: 2, mata_kuliah_id: 2, dosen_id: 1, tahun_akademik_id: 3, nama_kelas: 'A', kapasitas: 40, ruangan: 'Lab TI 2', hari: 'selasa', jam_mulai: '08:00', jam_selesai: '10:30' },
{ id: 3, mata_kuliah_id: 5, dosen_id: 4, tahun_akademik_id: 3, nama_kelas: 'A', kapasitas: 40, ruangan: 'R201', hari: 'rabu', jam_mulai: '10:30', jam_selesai: '13:00' },
{ id: 4, mata_kuliah_id: 7, dosen_id: 2, tahun_akademik_id: 3, nama_kelas: 'A', kapasitas: 80, ruangan: 'Aula', hari: 'kamis', jam_mulai: '08:00', jam_selesai: '09:40' },
{ id: 5, mata_kuliah_id: 3, dosen_id: 3, tahun_akademik_id: 3, nama_kelas: 'A', kapasitas: 40, ruangan: 'Lab TI 1', hari: 'jumat', jam_mulai: '08:00', jam_selesai: '10:30' },
]);

// 5. Jadwal Ujian (UTS & UAS) untuk kelas 1-3
await knex('jadwal_ujian').insert([
{ kelas_id: 1, jenis_ujian: 'UTS', tanggal: '2025-10-20', jam_mulai: '08:00', jam_selesai: '09:30', ruangan: 'Lab TI 1' },
{ kelas_id: 1, jenis_ujian: 'UAS', tanggal: '2026-01-12', jam_mulai: '08:00', jam_selesai: '09:30', ruangan: 'Lab TI 1' },
{ kelas_id: 2, jenis_ujian: 'UTS', tanggal: '2025-10-21', jam_mulai: '08:00', jam_selesai: '09:30', ruangan: 'Lab TI 2' },
{ kelas_id: 2, jenis_ujian: 'UAS', tanggal: '2026-01-13', jam_mulai: '08:00', jam_selesai: '09:30', ruangan: 'Lab TI 2' },
{ kelas_id: 3, jenis_ujian: 'UTS', tanggal: '2025-10-22', jam_mulai: '10:30', jam_selesai: '12:00', ruangan: 'R201' },
{ kelas_id: 3, jenis_ujian: 'UAS', tanggal: '2026-01-14', jam_mulai: '10:30', jam_selesai: '12:00', ruangan: 'R201' },
]);

// 6. KRS + KRS Detail — Andi Wijaya (mahasiswa 1, TI) & Eko Prasetyo (mahasiswa 3, SI)
await knex('krs').insert([
{ id: 1, mahasiswa_id: 1, tahun_akademik_id: 3, status: 'disetujui', tanggal_pengajuan: knex.fn.now(), tanggal_disetujui: knex.fn.now() },
{ id: 2, mahasiswa_id: 3, tahun_akademik_id: 3, status: 'disetujui', tanggal_pengajuan: knex.fn.now(), tanggal_disetujui: knex.fn.now() },
]);
await knex('krs_detail').insert([
{ krs_id: 1, kelas_id: 1 }, // Andi -> Algoritma dan Pemrograman
{ krs_id: 1, kelas_id: 4 }, // Andi -> Pendidikan Agama
{ krs_id: 2, kelas_id: 3 }, // Eko -> Pengantar Sistem Informasi
{ krs_id: 2, kelas_id: 4 }, // Eko -> Pendidikan Agama
]);

// 7. Nilai — contoh nilai yang sudah keluar untuk kelas 1 & 3
await knex('nilai').insert([
{ mahasiswa_id: 1, kelas_id: 1, nilai_tugas: 85, nilai_uts: 80, nilai_uas: 88, nilai_angka: 84.5, nilai_huruf: 'A', bobot: 4.0 },
{ mahasiswa_id: 3, kelas_id: 3, nilai_tugas: 75, nilai_uts: 70, nilai_uas: 78, nilai_angka: 74.5, nilai_huruf: 'B', bobot: 3.0 },
]);

// 8. Absensi — 3 pertemuan pertama kelas 1 untuk Andi Wijaya
await knex('absensi').insert([
{ kelas_id: 1, mahasiswa_id: 1, tanggal: '2025-09-08', pertemuan_ke: 1, status: 'hadir' },
{ kelas_id: 1, mahasiswa_id: 1, tanggal: '2025-09-15', pertemuan_ke: 2, status: 'hadir' },
{ kelas_id: 1, mahasiswa_id: 1, tanggal: '2025-09-22', pertemuan_ke: 3, status: 'izin' },
]);

// 9. Tagihan + Pembayaran
await knex('tagihan').insert([
{ id: 1, mahasiswa_id: 1, tahun_akademik_id: 3, jenis_tagihan: 'UKT', jumlah: 5000000, jatuh_tempo: '2025-09-15', status: 'lunas' },
{ id: 2, mahasiswa_id: 3, tahun_akademik_id: 3, jenis_tagihan: 'UKT', jumlah: 4500000, jatuh_tempo: '2025-09-15', status: 'belum_bayar' },
]);
await knex('pembayaran').insert([
{ tagihan_id: 1, jumlah_bayar: 5000000, metode: 'transfer_bank', bukti_bayar: 'bukti-tf-001.jpg', tanggal_bayar: '2025-09-10 10:15:00' },
]);

// 10. Pengajuan — mahasiswa 10 (Julia Permata, status cuti) & mahasiswa 1
await knex('pengajuan').insert([
{ mahasiswa_id: 10, jenis_pengajuan: 'cuti_akademik', deskripsi: 'Mengajukan cuti akademik karena alasan kesehatan.', status: 'disetujui', catatan_admin: 'Disetujui, cuti berlaku 1 semester.' },
{ mahasiswa_id: 1, jenis_pengajuan: 'surat_keterangan', deskripsi: 'Membutuhkan surat keterangan aktif kuliah untuk keperluan beasiswa.', status: 'diajukan', catatan_admin: null },
]);

// 11. Dosen Pembimbing Akademik (dosen_pa_id) untuk mahasiswa jurusan TI & SI
//     Dosen id 1 & 3 (jurusan TI) membimbing mahasiswa TI (jurusan_id=1)
//     Dosen id 4 (jurusan SI) membimbing mahasiswa SI (jurusan_id=2)
await knex('mahasiswa').where({ id: 1 }).update({ dosen_pa_id: 1 }); // Andi Wijaya -> Budi Santoso
await knex('mahasiswa').where({ id: 2 }).update({ dosen_pa_id: 3 }); // Citra Kirana -> Ahmad Fauzi
await knex('mahasiswa').where({ id: 3 }).update({ dosen_pa_id: 4 }); // Eko Prasetyo -> Rina Kartika
await knex('mahasiswa').where({ id: 7 }).update({ dosen_pa_id: 1 }); // Gilang Ramadhan -> Budi Santoso
await knex('mahasiswa').where({ id: 8 }).update({ dosen_pa_id: 4 }); // Hany Kurnia -> Rina Kartika
await knex('mahasiswa').where({ id: 11 }).update({ dosen_pa_id: 3 }); // Krisna Aditya -> Ahmad Fauzi
await knex('mahasiswa').where({ id: 14 }).update({ dosen_pa_id: 4 }); // Nadia Salsabila -> Rina Kartika

console.log('✅ Seed akademik berhasil dimasukkan:');
console.log('   3 tahun akademik, 9 mata kuliah, 3 relasi prasyarat, 5 kelas, 6 jadwal ujian,');
console.log('   2 KRS (4 detail), 2 nilai, 3 absensi, 2 tagihan (1 pembayaran), 2 pengajuan,');
console.log('   7 mahasiswa terhubung ke dosen pembimbing akademik (dosen_pa_id)');
}
