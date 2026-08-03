"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
exports.default = config;
//# sourceMappingURL=knex.config.js.map