import db from '../config/database.js';

export const krsRepository = {
getActiveTahunAkademik() {
return db('tahun_akademik').where({ is_aktif: true }).first();
},

getKrsByMahasiswaAndTahun(mahasiswaId: number, tahunAkademikId: number) {
return db('krs')
.where({ mahasiswa_id: mahasiswaId, tahun_akademik_id: tahunAkademikId })
.first();
},

async createKrs(mahasiswaId: number, tahunAkademikId: number) {
const [id] = await db('krs').insert({
mahasiswa_id: mahasiswaId,
tahun_akademik_id: tahunAkademikId,
status: 'draft',
});
return id;
},

getKrsById(krsId: number) {
return db('krs').where({ id: krsId }).first();
},

getKrsDetail(krsId: number) {
return db('krs_detail as kd')
.join('kelas as k', 'kd.kelas_id', 'k.id')
.join('mata_kuliah as mk', 'k.mata_kuliah_id', 'mk.id')
.leftJoin('dosen as d', 'k.dosen_id', 'd.id')
.select(
'kd.id as krs_detail_id',
'k.id as kelas_id',
'mk.id as mata_kuliah_id',
'mk.kode_mk',
'mk.nama_mk',
'mk.sks',
'k.nama_kelas',
'k.hari',
'k.jam_mulai',
'k.jam_selesai',
'k.ruangan',
'd.nama_lengkap as dosen_nama'
)
.where('kd.krs_id', krsId);
},

getAvailableClasses(jurusanId: number, tahunAkademikId: number) {
return db('kelas as k')
.join('mata_kuliah as mk', 'k.mata_kuliah_id', 'mk.id')
.leftJoin('dosen as d', 'k.dosen_id', 'd.id')
.select(
'k.id as kelas_id',
'mk.id as mata_kuliah_id',
'mk.kode_mk',
'mk.nama_mk',
'mk.sks',
'mk.semester_ke',
'k.nama_kelas',
'k.kapasitas',
'k.hari',
'k.jam_mulai',
'k.jam_selesai',
'k.ruangan',
'd.nama_lengkap as dosen_nama'
)
.where('k.tahun_akademik_id', tahunAkademikId)
.andWhere((qb) => {
qb.where('mk.jurusan_id', jurusanId).orWhereNull('mk.jurusan_id');
})
.orderBy([{ column: 'mk.semester_ke' }, { column: 'mk.kode_mk' }]);
},

getPrasyaratMap(mataKuliahIds: number[]) {
if (!mataKuliahIds.length) return Promise.resolve([]);
return db('mata_kuliah_prasyarat as mkp')
.join('mata_kuliah as mk', 'mkp.prasyarat_id', 'mk.id')
.select('mkp.mata_kuliah_id', 'mkp.prasyarat_id', 'mk.kode_mk', 'mk.nama_mk')
.whereIn('mkp.mata_kuliah_id', mataKuliahIds);
},

getLulusMataKuliahIds(mahasiswaId: number) {
return db('nilai as n')
.join('kelas as k', 'n.kelas_id', 'k.id')
.select('k.mata_kuliah_id')
.where('n.mahasiswa_id', mahasiswaId)
.whereNotNull('n.nilai_huruf')
.whereNot('n.nilai_huruf', 'E');
},

countEnrolledInKelas(kelasId: number) {
return db('krs_detail as kd')
.join('krs', 'kd.krs_id', 'krs.id')
.where('kd.kelas_id', kelasId)
.whereIn('krs.status', ['diajukan', 'disetujui'])
.count('kd.id as total')
.first();
},

addDetail(krsId: number, kelasId: number) {
return db('krs_detail').insert({ krs_id: krsId, kelas_id: kelasId });
},

removeDetail(krsId: number, kelasId: number) {
return db('krs_detail').where({ krs_id: krsId, kelas_id: kelasId }).del();
},

setStatus(krsId: number, status: string) {
return db('krs').where({ id: krsId }).update({ status });
},

updateStatusToDiajukan(krsId: number) {
return db('krs')
.where({ id: krsId })
.update({ status: 'diajukan', tanggal_pengajuan: db.fn.now() });
},
};