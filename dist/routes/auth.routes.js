"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_js_1.authController.register);
router.post('/login', auth_controller_js_1.authController.login);
router.get('/me', auth_middleware_js_1.authMiddleware, auth_controller_js_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map