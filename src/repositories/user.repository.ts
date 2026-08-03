import db from '../config/database.js';

export interface UserRecord {
id: number;
nomor_induk: string;
username: string;
nama_lengkap: string | null;
email: string | null;
password_hash: string;
role: 'mahasiswa' | 'dosen' | 'pegawai' | 'admin';
mahasiswa_id: number | null;
dosen_id: number | null;
pegawai_id: number | null;
is_active: boolean;
verification_token: string | null;
verification_token_expires: Date | null;
email_verified_at: Date | null;
}

const TABLE = 'users';

export const userRepository = {
findByUsername(username: string) {
return db<UserRecord>(TABLE).where({ username }).first();
},
findByNomorInduk(nomorInduk: string) {
return db<UserRecord>(TABLE).where({ nomor_induk: nomorInduk }).first();
},
findByEmail(email: string) {
return db<UserRecord>(TABLE).where({ email }).first();
},
findByIdentifier(identifier: string) {
return db<UserRecord>(TABLE)
.where({ username: identifier })
.orWhere({ nomor_induk: identifier })
.first();
},
findByVerificationToken(token: string) {
return db<UserRecord>(TABLE).where({ verification_token: token }).first();
},
async create(data: Partial<UserRecord>) {
const [id] = await db<UserRecord>(TABLE).insert(data);
return db<UserRecord>(TABLE).where({ id }).first();
},
async setVerificationToken(id: number, token: string, expires: Date) {
await db<UserRecord>(TABLE)
.where({ id })
.update({ verification_token: token, verification_token_expires: expires });
},
async markEmailVerified(id: number) {
await db<UserRecord>(TABLE)
.where({ id })
.update({
email_verified_at: new Date(),
verification_token: null,
verification_token_expires: null,
});
},
async updatePassword(id: number, password_hash: string) {
await db<UserRecord>(TABLE).where({ id }).update({ password_hash });
},
};