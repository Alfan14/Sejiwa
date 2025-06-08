import express from 'express';
import db_consultation from '../../controllers/consultationController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/consultations', authenticate, authorize(['konselor','pelajar','admin']),db_consultation.getConsultations);
router.get('/consultations/:id', authenticate, authorize(['konselor','pelajar','admin']),db_consultation.getConsultationById);
router.post('/consultations', authenticate, authorize(['konselor','admin']),db_consultation.createConsultation);
router.put('/consultations/:id', authenticate, authorize(['konselor','admin']), db_consultation.updateConsultation);
router.delete('/consultations/:id', authenticate, authorize(['admin']), db_consultation.deleteConsultation);

export default router;