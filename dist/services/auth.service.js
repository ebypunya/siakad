"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthError = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_js_1 = require("../repositories/user.repository.js");
class AuthError extends Error {
    status;
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}
exports.AuthError = AuthError;
exports.authService = {
    async register(input) {
        const { fullname, nim, email, password } = input;
        if (!fullname || !nim || !email || !password) {
            throw new AuthError('Semua kolom wajib diisi.');
        }
        if (password.length < 8) {
            throw new AuthError('Kata sandi minimal 8 karakter.');
        }
        const [existingNim, existingEmail] = await Promise.all([
            user_repository_js_1.userRepository.findByNomorInduk(nim),
            user_repository_js_1.userRepository.findByEmail(email),
        ]);
        if (existingNim)
            throw new AuthError('NIM sudah terdaftar.');
        if (existingEmail)
            throw new AuthError('Email sudah terdaftar.');
        const password_hash = await bcryptjs_1.default.hash(password, 10);
        return user_repository_js_1.userRepository.create({
            nomor_induk: nim,
            username: nim,
            nama_lengkap: fullname,
            email,
            password_hash,
            role: 'mahasiswa',
            is_active: true,
        });
    },
    async login(input) {
        const { username, password } = input;
        if (!username || !password) {
            throw new AuthError('NIM/Username dan kata sandi wajib diisi.');
        }
        const user = await user_repository_js_1.userRepository.findByIdentifier(username);
        if (!user)
            throw new AuthError('NIM/Username atau kata sandi salah.', 401);
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch)
            throw new AuthError('NIM/Username atau kata sandi salah.', 401);
        if (!user.is_active)
            throw new AuthError('Akun tidak aktif.', 403);
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return { token, user };
    },
};
//# sourceMappingURL=auth.service.js.map