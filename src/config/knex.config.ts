import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
development: {
client: process.env.DB_CLIENT || 'mysql2',
connection: {
host: process.env.DB_HOST || 'localhost',
port: Number(process.env.DB_PORT) || 3306,
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || '',
database: process.env.DB_NAME || 'siakad',
},
pool: {
min: 2,
max: 10,
},
migrations: {
directory: './db/migrations',
extension: 'ts',
},
seeds: {
directory: './db/seeds',
extension: 'ts',
},
},
};

export default config;