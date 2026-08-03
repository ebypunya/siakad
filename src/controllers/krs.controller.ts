import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { krsService } from '../services/krs.service.js';
import { AuthError } from '../services/auth.service.js';

function handleError(err: unknown, res: Response) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}

export const krsController = {
async state(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
res.json(await krsService.getState(req.user));
} catch (err) {
handleError(err, res);
}
},

async availableClasses(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
res.json(await krsService.getAvailableClasses(req.user));
} catch (err) {
handleError(err, res);
}
},

async addClass(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
const kelasId = Number(req.body.kelas_id);
if (!kelasId) return res.status(400).json({ message: 'kelas_id wajib diisi.' });
await krsService.addClass(req.user, kelasId);
const state = await krsService.getState(req.user);
res.json({ message: 'Mata kuliah berhasil ditambahkan.', ...state });
} catch (err) {
handleError(err, res);
}
},

async removeClass(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
const kelasId = Number(req.params.kelasId);
await krsService.removeClass(req.user, kelasId);
const state = await krsService.getState(req.user);
res.json({ message: 'Mata kuliah berhasil dihapus.', ...state });
} catch (err) {
handleError(err, res);
}
},

async submit(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
await krsService.submit(req.user);
const state = await krsService.getState(req.user);
res.json({ message: 'KRS berhasil diajukan. Menunggu persetujuan dosen PA.', ...state });
} catch (err) {
handleError(err, res);
}
},
};