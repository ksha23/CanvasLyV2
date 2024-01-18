import { Router } from 'express';
import usersRoutes from './users';
import calendarRoutes from './calendars';
import assignmentsRoutes from './assignments';
import canvasRoutes from './canvasRouter';

const router = Router();

router.use('/users', usersRoutes);
router.use('/calendars', calendarRoutes);
router.use('/assignments', assignmentsRoutes);
router.use('/canvas', canvasRoutes);

export default router;
