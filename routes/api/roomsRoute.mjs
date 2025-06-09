import express from 'express';
import db_room from '../../controllers/roomsController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.post('/create-room', authenticate, authorize(['pelajar','konselor']),db_room.createRoom)

export default router;