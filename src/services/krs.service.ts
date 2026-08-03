import db from '../config/database.js';
import { krsRepository } from '../repositories/krs.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { AuthError } from './auth.service.js';
import { AuthPayload } from '../middlewares/auth.middleware.js';

const MAX_SKS = 24;

async function getMahasiswaContext(authUser: AuthPayload) {
if (authUser.role !== 'mahasiswa') {
throw new AuthError('Fitur KRS hanya untuk mahasiswa.', 403);
}
const user = await userRepository.findByUsername(authUser.username);
if (!user || !user.mahasiswa_id) {
throw new AuthError('Data mahasiswa tidak ditemukan.', 404);
}
const mahasiswa = await db('mahasiswa').where({ id: user.mahasiswa_id }).first();
if (!mahasiswa) throw new AuthError('Data mahasiswa tidak ditemukan.', 404);
return mahasiswa;
}

async function ensureKrs(mahasiswaId: number, tahunAkademikId: number) {
let krs = await krsRepository.getKrsByMahasiswaAndTahun(mahasiswaId, tahunAkademikId);
if (!krs) {
const id = await krsRepository.createKrs(mahasiswaId, tahunAkademikId);
krs = await krsRepository.getKrsById(id);
}
return krs!;
}

export const krsService = {
async getState(authUser: AuthPayload) {
const mahasiswa = await getMahasiswaContext(authUser);
const tahunAkademik = await krsRepository.getActiveTahunAkademik();

if (!tahunAkademik) {
return { tahunAkademik: null, krs: null, detail: [], totalSks: 0, maxSks: MAX_SKS };
}

const krs = await ensureKrs(mahasiswa.id, tahunAkademik.id);
const detail = await krsRepository.getKrsDetail(krs.id);
const totalSks = detail.reduce((sum, d: any) => sum + Number(d.sks), 0);

return { tahunAkademik, krs, detail, totalSks, maxSks: MAX_SKS };
},

async getAvailableClasses(authUser: AuthPayload) {
const mahasiswa = await getMahasiswaContext(authUser);
const tahunAkademik = await krsRepository.getActiveTahunAkademik();
if (!tahunAkademik) return { classes: [], tahunAkademik: null };

const classes = await krsRepository.getAvailableClasses(mahasiswa.jurusan_id, tahunAkademik.id);
const mataKuliahIds = [...new Set(classes.map((c: any) => c.mata_kuliah_id))];

const [prasyaratRows, lulusRows] = await Promise.all([
krsRepository.getPrasyaratMap(mataKuliahIds),
krsRepository.getLulusMataKuliahIds(mahasiswa.id),
]);

const lulusSet = new Set((lulusRows as any[]).map((r) => r.mata_kuliah_id));
const prasyaratByMk = new Map<number, any[]>();
for (const row of prasyaratRows as any[]) {
if (!prasyaratByMk.has(row.mata_kuliah_id)) prasyaratByMk.set(row.mata_kuliah_id, []);
prasyaratByMk.get(row.mata_kuliah_id)!.push(row);
}

const withStatus = classes.map((c: any) => {
const prasyaratList = prasyaratByMk.get(c.mata_kuliah_id) || [];
const belumLulus = prasyaratList.filter((p) => !lulusSet.has(p.prasyarat_id));
return {
...c,
prasyarat: prasyaratList.map((p) => ({ kode_mk: p.kode_mk, nama_mk: p.nama_mk })),
prasyaratTerpenuhi: belumLulus.length === 0,
};
});

return { classes: withStatus, tahunAkademik };
},

async addClass(authUser: AuthPayload, kelasId: number) {
const mahasiswa = await getMahasiswaContext(authUser);
const tahunAkademik = await krsRepository.getActiveTahunAkademik();
if (!tahunAkademik) throw new AuthError('Periode KRS belum dibuka.', 400);

const krs = await ensureKrs(mahasiswa.id, tahunAkademik.id);
if (krs.status !== 'draft' && krs.status !== 'ditolak') {
throw new AuthError('KRS sudah diajukan dan tidak dapat diubah.', 400);
}

const existingDetail = await krsRepository.getKrsDetail(krs.id);
if (existingDetail.some((d: any) => d.kelas_id === kelasId)) {
throw new AuthError('Mata kuliah sudah ada di KRS kamu.', 400);
}

const totalSks = existingDetail.reduce((s, d: any) => s + Number(d.sks), 0);
const kelas = await db('kelas as k')
.join('mata_kuliah as mk', 'k.mata_kuliah_id', 'mk.id')
.select('k.id', 'mk.sks', 'k.kapasitas')
.where('k.id', kelasId)
.first();
if (!kelas) throw new AuthError('Kelas tidak ditemukan.', 404);

if (totalSks + Number(kelas.sks) > MAX_SKS) {
throw new AuthError(`Total SKS akan melebihi batas maksimal ${MAX_SKS} SKS.`, 400);
}

const enrolled = await krsRepository.countEnrolledInKelas(kelasId);
if (Number(enrolled?.total || 0) >= kelas.kapasitas) {
throw new AuthError('Kelas sudah penuh.', 400);
}

if (krs.status === 'ditolak') {
await krsRepository.setStatus(krs.id, 'draft');
}

await krsRepository.addDetail(krs.id, kelasId);
},

async removeClass(authUser: AuthPayload, kelasId: number) {
const mahasiswa = await getMahasiswaContext(authUser);
const tahunAkademik = await krsRepository.getActiveTahunAkademik();
if (!tahunAkademik) throw new AuthError('Periode KRS belum dibuka.', 400);

const krs = await krsRepository.getKrsByMahasiswaAndTahun(mahasiswa.id, tahunAkademik.id);
if (!krs) throw new AuthError('KRS tidak ditemukan.', 404);
if (krs.status !== 'draft' && krs.status !== 'ditolak') {
throw new AuthError('KRS sudah diajukan dan tidak dapat diubah.', 400);
}

await krsRepository.removeDetail(krs.id, kelasId);
},

async submit(authUser: AuthPayload) {
const mahasiswa = await getMahasiswaContext(authUser);
const tahunAkademik = await krsRepository.getActiveTahunAkademik();
if (!tahunAkademik) throw new AuthError('Periode KRS belum dibuka.', 400);

const krs = await krsRepository.getKrsByMahasiswaAndTahun(mahasiswa.id, tahunAkademik.id);
if (!krs) throw new AuthError('KRS tidak ditemukan.', 404);
if (krs.status !== 'draft' && krs.status !== 'ditolak') {
throw new AuthError('KRS ini sudah diajukan sebelumnya.', 400);
}

const detail = await krsRepository.getKrsDetail(krs.id);
if (detail.length === 0) {
throw new AuthError('Tambahkan minimal 1 mata kuliah sebelum mengajukan KRS.', 400);
}

await krsRepository.updateStatusToDiajukan(krs.id);
},
};