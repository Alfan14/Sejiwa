import express from 'express';
import db_consultation from '../../db/queries_consultations.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/consultations', authenticate, authorize(['konselor']),db_consultation.getConsultations);
router.get('/consultations/:id', authenticate, authorize(['konselor']),db_consultation.getConsultationById);
router.post('/consultations', authenticate, authorize(['konselor']),db_consultation.createConsultation);
router.put('/consultations/:id', authenticate, authorize(['konselor']), db_consultation.updateConsultation);
router.delete('/consultations/:id', authenticate, authorize(['konselor']), db_consultation.deleteConsultation);

export default router;