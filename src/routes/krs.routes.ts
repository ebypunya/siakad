import { Router } from 'express';
import { krsController } from '../controllers/krs.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/me', authMiddleware, krsController.state);
router.get('/available', authMiddleware, krsController.availableClasses);
router.post('/detail', authMiddleware, krsController.addClass);
router.delete('/detail/:kelasId', authMiddleware, krsController.removeClass);
router.post('/submit', authMiddleware, krsController.submit);

export default router;