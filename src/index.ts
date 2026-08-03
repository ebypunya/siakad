import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';

dotenv.config();

const app = express();
//const PORT = process.env.PORT || 80;
const PORT = process.env.PORT || 3000;

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve asset statis (gambar, css, js) dari public
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// ==========================================
// ROUTE HALAMAN (CLEAN URL)
// ==========================================

// Alamat utama: http://localhost -> Login
app.get('/', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

// http://localhost/login
app.get('/login', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

// http://localhost/register
app.get('/register', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'register.html'));
});

// http://localhost/forgot-password
app.get('/forgot-password', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'forgot-password.html'));
});

// http://localhost/dashboard
app.get('/dashboard', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'dashboard.html'));
});

// http://localhost/profil
app.get('/profil', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'profil.html'));
});

// http://localhost/krs
app.get('/krs', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'krs.html'));
});

// ==========================================
// ROUTE API BACKEND
// ==========================================

app.get('/api/health', async (req: Request, res: Response) => {
try {
const [rows] = await db.raw('SELECT 1 + 1 AS result');
res.json({
status: 'OK',
message: 'Server Express & MariaDB terhubung!',
testQuery: rows[0]
});
} catch (error) {
res.status(500).json({ status: 'ERROR', message: (error as Error).message });
}
});

// Handling 404
app.use((req: Request, res: Response) => {
res.status(404).send('<h1 style="text-align:center; margin-top:50px;">404 - Halaman tidak ditemukan</h1>');
});

// Jalankan Server
app.listen(PORT, () => {
console.log(`=================================================`);
console.log(`🚀 SIAKAD Clean URL aktif di: http://localhost`);
console.log(`=================================================`);
});