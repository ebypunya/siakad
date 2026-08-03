import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT) || 465,
secure: process.env.SMTP_SECURE === 'true',
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASSWORD,
},
});

export const mailService = {
async sendVerificationEmail(to: string, nama: string, token: string) {
const link = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

await transporter.sendMail({
from: process.env.SMTP_FROM,
to,
subject: 'Konfirmasi Pendaftaran — SIAKAD UkCorelabs',
html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
<h2 style="color:#2541b2;">Halo, ${nama}!</h2>
<p>Terima kasih telah mendaftar di <strong>SIAKAD UkCorelabs</strong>. Klik tombol di bawah untuk mengaktifkan akun kamu:</p>
<p style="text-align:center; margin: 28px 0;">
<a href="${link}" style="background:#2541b2; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
Verifikasi Email Saya
</a>
</p>
<p style="font-size:13px; color:#64748b;">Atau salin link berikut ke browser kamu:<br>${link}</p>
<p style="font-size:13px; color:#64748b;">Tautan ini berlaku selama 24 jam.</p>
</div>
`,
});
},
};