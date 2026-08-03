"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = __importDefault(require("./config/database.js"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//const PORT = process.env.PORT || 80;
const PORT = process.env.PORT || 3000;
// Middleware dasar
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve asset statis (gambar, css, js) dari public
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use('/api/auth', auth_routes_js_1.default);
// ==========================================
// ROUTE HALAMAN (CLEAN URL)
// ==========================================
// Alamat utama: http://localhost -> Login
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'login.html'));
});
// http://localhost/login
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'login.html'));
});
// http://localhost/register
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'register.html'));
});
// http://localhost/forgot-password
app.get('/forgot-password', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'forgot-password.html'));
});
// http://localhost/dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'dashboard.html'));
});
// http://localhost/krs
app.get('/krs', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'krs.html'));
});
// ==========================================
// ROUTE API BACKEND
// ==========================================
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await database_js_1.default.raw('SELECT 1 + 1 AS result');
        res.json({
            status: 'OK',
            message: 'Server Express & MariaDB terhubung!',
            testQuery: rows[0]
        });
    }
    catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});
// Handling 404
app.use((req, res) => {
    res.status(404).send('<h1 style="text-align:center; margin-top:50px;">404 - Halaman tidak ditemukan</h1>');
});
// Jalankan Server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 SIAKAD Clean URL aktif di: http://localhost`);
    console.log(`=================================================`);
});
//# sourceMappingURL=index.js.map