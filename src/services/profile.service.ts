import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { AuthError } from './auth.service.js';
import { AuthPayload } from '../middlewares/auth.middleware.js';

export const profileService = {
async getProfile(authUser: AuthPayload) {
const user = await userRepository.findByUsername(authUser.username);
if (!user) throw new AuthError('Pengguna tidak ditemukan.', 404);

let detail: any = null;
if (user.role === 'mahasiswa' && user.mahasiswa_id) {
detail = await profileRepository.getMahasiswaProfile(user.mahasiswa_id);
} else if (user.role === 'dosen' && user.dosen_id) {
detail = await profileRepository.getDosenProfile(user.dosen_id);
} else if (user.role === 'pegawai' && user.pegawai_id) {
detail = await profileRepository.getPegawaiProfile(user.pegawai_id);
}

const { password_hash, verification_token, verification_token_expires, ...safeUser } = user;
return { user: safeUser, detail };
},

async updateNoHp(authUser: AuthPayload, rawNoHp: string) {
const no_hp = (rawNoHp || '').trim();
if (no_hp && !/^[0-9+\-\s]{8,20}$/.test(no_hp)) {
throw new AuthError('Format nomor HP tidak valid.');
}

const user = await userRepository.findByUsername(authUser.username);
if (!user) throw new AuthError('Pengguna tidak ditemukan.', 404);

if (user.role === 'mahasiswa' && user.mahasiswa_id) {
await profileRepository.updateMahasiswaNoHp(user.mahasiswa_id, no_hp);
} else if (user.role === 'dosen' && user.dosen_id) {
await profileRepository.updateDosenNoHp(user.dosen_id, no_hp);
} else if (user.role === 'pegawai' && user.pegawai_id) {
await profileRepository.updatePegawaiNoHp(user.pegawai_id, no_hp);
} else {
throw new AuthError('Profil untuk role ini tidak dapat diperbarui.', 400);
}
},

async changePassword(authUser: AuthPayload, oldPassword: string, newPassword: string) {
if (!oldPassword || !newPassword) {
throw new AuthError('Kata sandi lama dan baru wajib diisi.');
}
if (newPassword.length < 8) {
throw new AuthError('Kata sandi baru minimal 8 karakter.');
}

const user = await userRepository.findByUsername(authUser.username);
if (!user) throw new AuthError('Pengguna tidak ditemukan.', 404);

const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
if (!isMatch) throw new AuthError('Kata sandi lama tidak sesuai.', 401);

const password_hash = await bcrypt.hash(newPassword, 10);
await userRepository.updatePassword(user.id, password_hash);
},
};
