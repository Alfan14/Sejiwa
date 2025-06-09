import express from 'express';
import db_room from '../../controllers/chatsController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.post('/chats', authenticate, authorize(['pelajar','konselor']),db_room.createRoom)
router.get('/chats', authenticate, authorize(['pelajar','konselor']),db_room.getRoom)
router.get('/chats', authenticate, authorize(['pelajar','konselor']),db_room.getRoomById)


export default router;