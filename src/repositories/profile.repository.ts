import db from '../config/database.js';

export const profileRepository = {
async getMahasiswaProfile(mahasiswaId: number) {
return db('mahasiswa as m')
.leftJoin('jurusan as j', 'm.jurusan_id', 'j.id')
.leftJoin('fakultas as f', 'j.fakultas_id', 'f.id')
.leftJoin('dosen as dpa', 'm.dosen_pa_id', 'dpa.id')
.select(
'm.id',
'm.nim',
'm.nama_lengkap',
'm.jenis_kelamin',
'm.email',
'm.no_hp',
'm.angkatan',
'm.status',
'j.nama_jurusan',
'j.kode_jurusan',
'j.jenjang',
'f.nama_fakultas',
'dpa.id as dosen_pa_id',
'dpa.nama_lengkap as dosen_pa_nama',
'dpa.gelar_depan as dosen_pa_gelar_depan',
'dpa.gelar_belakang as dosen_pa_gelar_belakang',
'dpa.email as dosen_pa_email'
)
.where('m.id', mahasiswaId)
.first();
},

async getDosenProfile(dosenId: number) {
return db('dosen as d')
.leftJoin('jurusan as j', 'd.jurusan_id', 'j.id')
.leftJoin('fakultas as f', 'j.fakultas_id', 'f.id')
.select(
'd.id',
'd.nidn',
'd.nama_lengkap',
'd.gelar_depan',
'd.gelar_belakang',
'd.jenis_kelamin',
'd.email',
'd.no_hp',
'j.nama_jurusan',
'f.nama_fakultas'
)
.where('d.id', dosenId)
.first();
},

async getPegawaiProfile(pegawaiId: number) {
return db('pegawai as p')
.leftJoin('jabatan as jb', 'p.jabatan_id', 'jb.id')
.select(
'p.id',
'p.nip',
'p.nama_lengkap',
'p.jenis_kelamin',
'p.email',
'p.no_hp',
'jb.nama_jabatan',
'jb.keterangan as jabatan_keterangan'
)
.where('p.id', pegawaiId)
.first();
},

updateMahasiswaNoHp(mahasiswaId: number, no_hp: string) {
return db('mahasiswa').where({ id: mahasiswaId }).update({ no_hp });
},
updateDosenNoHp(dosenId: number, no_hp: string) {
return db('dosen').where({ id: dosenId }).update({ no_hp });
},
updatePegawaiNoHp(pegawaiId: number, no_hp: string) {
return db('pegawai').where({ id: pegawaiId }).update({ no_hp });
},
};
