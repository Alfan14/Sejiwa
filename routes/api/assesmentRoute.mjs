import express from 'express';
import assessmentController from '../../controllers/assesmentController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.post('/assessment/submit', assessmentController.submitAssessment);
router.get('/assessment/answer', assessmentController.saveAssessmentAnswer);
router.get('/assessment/questions', assessmentController.getQuestions);

export default router;

