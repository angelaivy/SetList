import { Router } from 'express';
import authRoutes from './auth';
import artistRoutes from './artist';
import eventsRoutes from './events';

const router = Router();

router.use('/auth', authRoutes);
router.use('/artist', artistRoutes);
router.use('/events', eventsRoutes);

export default router;
