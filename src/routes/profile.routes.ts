import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/me', authMiddleware, profileController.me);
router.put('/no-hp', authMiddleware, profileController.updateNoHp);
router.put('/password', authMiddleware, profileController.changePassword);

export default router;
