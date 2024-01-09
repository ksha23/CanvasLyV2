import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import calendarRoutes from './calendars';
import assignmentsRoutes from './assignments';

const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/calendars', calendarRoutes);
router.use('/assignments', assignmentsRoutes);

export default router;
