import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';

export class AuthError extends Error {
status: number;
constructor(message: string, status = 400) {
super(message);
this.status = status;
}
}

interface RegisterInput { fullname: string; nim: string; email: string; password: string; }
interface LoginInput { username: string; password: string; }

export const authService = {
async register(input: RegisterInput) {
const { fullname, nim, email, password } = input;

if (!fullname || !nim || !email || !password) {
throw new AuthError('Semua kolom wajib diisi.');
}
if (password.length < 8) {
throw new AuthError('Kata sandi minimal 8 karakter.');
}

const [existingNim, existingEmail] = await Promise.all([
userRepository.findByNomorInduk(nim),
userRepository.findByEmail(email),
]);
if (existingNim) throw new AuthError('NIM sudah terdaftar.');
if (existingEmail) throw new AuthError('Email sudah terdaftar.');

const password_hash = await bcrypt.hash(password, 10);

return userRepository.create({
nomor_induk: nim,
username: nim,
nama_lengkap: fullname,
email,
password_hash,
role: 'mahasiswa',
is_active: true,
});
},

async login(input: LoginInput) {
const { username, password } = input;
if (!username || !password) {
throw new AuthError('NIM/Username dan kata sandi wajib diisi.');
}

const user = await userRepository.findByIdentifier(username);
if (!user) throw new AuthError('NIM/Username atau kata sandi salah.', 401);

const isMatch = await bcrypt.compare(password, user.password_hash);
if (!isMatch) throw new AuthError('NIM/Username atau kata sandi salah.', 401);
if (!user.is_active) throw new AuthError('Akun tidak aktif.', 403);

const token = jwt.sign(
{ id: user.id, role: user.role, username: user.username },
process.env.JWT_SECRET || 'secret',
{ expiresIn: '1d' }
);

return { token, user };
},
};