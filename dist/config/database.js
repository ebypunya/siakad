"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knex_config_js_1 = __importDefault(require("./knex.config.js"));
const environment = process.env.NODE_ENV || 'development';
const db = (0, knex_1.default)(knex_config_js_1.default[environment]);
exports.default = db;
//# sourceMappingURL=database.js.map