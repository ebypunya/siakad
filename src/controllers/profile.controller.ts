import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { profileService } from '../services/profile.service.js';
import { AuthError } from '../services/auth.service.js';

export const profileController = {
async me(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
const result = await profileService.getProfile(req.user);
res.json(result);
} catch (err) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},

async updateNoHp(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
await profileService.updateNoHp(req.user, req.body.no_hp);
const result = await profileService.getProfile(req.user);
res.json({ message: 'Nomor HP berhasil diperbarui.', ...result });
} catch (err) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},

async changePassword(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });
const { oldPassword, newPassword } = req.body;
await profileService.changePassword(req.user, oldPassword, newPassword);
res.json({ message: 'Kata sandi berhasil diperbarui.' });
} catch (err) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},
};
