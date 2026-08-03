import { Request, Response } from 'express';
import { authService, AuthError } from '../services/auth.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const authController = {
async register(req: Request, res: Response) {
try {
const user = await authService.register(req.body);
const { password_hash, ...safeUser } = user!;
res.status(201).json({ message: 'Registrasi berhasil.', user: safeUser });
} catch (err) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},

async login(req: Request, res: Response) {
try {
const { token, user } = await authService.login(req.body);
const { password_hash, ...safeUser } = user;
res.json({ message: 'Login berhasil.', token, user: safeUser });
} catch (err) {
if (err instanceof AuthError) return res.status(err.status).json({ message: err.message });
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},

async me(req: AuthRequest, res: Response) {
try {
if (!req.user) return res.status(401).json({ message: 'Tidak terautentikasi.' });

const user = await userRepository.findByUsername(req.user.username);
if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });

const { password_hash, ...safeUser } = user;
res.json({ user: safeUser });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
}
},
};