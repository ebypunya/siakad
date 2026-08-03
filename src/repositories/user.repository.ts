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
async create(data: Partial<UserRecord>) {
const [id] = await db<UserRecord>(TABLE).insert(data);
return db<UserRecord>(TABLE).where({ id }).first();
},
};