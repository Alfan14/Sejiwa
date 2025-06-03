import express from 'express';
import db_schedule from '../../controllers/scheduleController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/schedules',authenticate, authorize(['konselor']) , db_schedule.getSchedules);
router.get('/schedules/:id',authenticate, authorize(['konselor']), db_schedule.getScheduleById);
router.post('/schedules', authenticate, authorize(['pelajar']),db_schedule.createSchedule);
router.put('/schedules/:id', authenticate, authorize(['pelajar']),db_schedule.updateSchedule);
router.delete('/schedules/:id',authenticate, authorize(['pelajar']), db_schedule.deleteSchedule);

export default router;