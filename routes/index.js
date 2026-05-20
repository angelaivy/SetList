import { Router } from 'express';
import authRoutes from './auth';
import artistRoutes from './artist';

const router = Router();

router.use('/auth', authRoutes);
router.use('/artist', artistRoutes);

export default router;
