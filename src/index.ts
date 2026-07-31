import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file statis Frontend dari folder public
app.use(express.static(path.join(process.cwd(), 'public')));

// 1. Route Alamat Utama (http://localhost) → langsung tampilkan halaman login
app.get('/', (req: Request, res: Response) => {
res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

// 2. Route status server (opsional, dipindah dari '/' lama)
app.get('/status', (req: Request, res: Response) => {
res.send(`
<div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
<h1>🚀 SIAKAD Backend + Frontend Berhasil Aktif!</h1>
<p>Server Express & MariaDB berjalan lancar di Port 80.</p>
<a href="/api/health" style="background: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Cek Koneksi Database (API Health)</a>
</div>
`);
});

// 3. Route Cek Koneksi Database (http://localhost/api/health)
app.get('/api/health', async (req: Request, res: Response) => {
try {
await db.raw('SELECT 1');
res.json({
status: 'OK',
message: 'Server SIAKAD & MariaDB terhubung dengan sukses!',
timestamp: new Date(),
});
} catch (error) {
res.status(500).json({
status: 'ERROR',
message: 'Gagal terhubung ke Database MariaDB',
error: (error as Error).message,
});
}
});

// Jalankan Server
app.listen(PORT, () => {
console.log(`=================================================`);
console.log(`🚀 Server SIAKAD aktif di: http://localhost`);
console.log(`=================================================`);
});