import express from 'express';
import db_analytics from '../../controllers/analyticsController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/analytics/totalUsers',authenticate, authorize(['konselor','admin']) ,db_analytics.totalUsers);
router.get('/analytics/totalSchedules',authenticate, authorize(['konselor','admin']) ,db_analytics.totalSchedules);
router.get('/analytics/totalAssessments',authenticate, authorize(['konselor','admin']) ,db_analytics.totalAssessment);
router.get('/analytics/scheduleCharts',authenticate, authorize(['konselor','admin']) ,db_analytics.schedulesCharts);

export default router;