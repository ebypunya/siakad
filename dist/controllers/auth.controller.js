"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const user_repository_js_1 = require("../repositories/user.repository.js");
exports.authController = {
    async register(req, res) {
        try {
            const user = await auth_service_js_1.authService.register(req.body);
            const { password_hash, ...safeUser } = user;
            res.status(201).json({ message: 'Registrasi berhasil.', user: safeUser });
        }
        catch (err) {
            if (err instanceof auth_service_js_1.AuthError)
                return res.status(err.status).json({ message: err.message });
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
        }
    },
    async login(req, res) {
        try {
            const { token, user } = await auth_service_js_1.authService.login(req.body);
            const { password_hash, ...safeUser } = user;
            res.json({ message: 'Login berhasil.', token, user: safeUser });
        }
        catch (err) {
            if (err instanceof auth_service_js_1.AuthError)
                return res.status(err.status).json({ message: err.message });
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
        }
    },
    async me(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: 'Tidak terautentikasi.' });
            const user = await user_repository_js_1.userRepository.findByUsername(req.user.username);
            if (!user)
                return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
            const { password_hash, ...safeUser } = user;
            res.json({ user: safeUser });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map