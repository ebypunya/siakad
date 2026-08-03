"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const database_js_1 = __importDefault(require("../config/database.js"));
const TABLE = 'users';
exports.userRepository = {
    findByUsername(username) {
        return (0, database_js_1.default)(TABLE).where({ username }).first();
    },
    findByNomorInduk(nomorInduk) {
        return (0, database_js_1.default)(TABLE).where({ nomor_induk: nomorInduk }).first();
    },
    findByEmail(email) {
        return (0, database_js_1.default)(TABLE).where({ email }).first();
    },
    findByIdentifier(identifier) {
        return (0, database_js_1.default)(TABLE)
            .where({ username: identifier })
            .orWhere({ nomor_induk: identifier })
            .first();
    },
    async create(data) {
        const [id] = await (0, database_js_1.default)(TABLE).insert(data);
        return (0, database_js_1.default)(TABLE).where({ id }).first();
    },
};
//# sourceMappingURL=user.repository.js.map