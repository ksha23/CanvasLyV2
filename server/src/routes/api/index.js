import { Router } from 'express';
import usersRoutes from './users';
import calendarRoutes from './calendars';
import assignmentsRoutes from './assignments';

const router = Router();

router.use('/users', usersRoutes);
router.use('/calendars', calendarRoutes);
router.use('/assignments', assignmentsRoutes);

export default router;
