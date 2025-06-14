import express from 'express';
import db_room from '../../controllers/chatsController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';
import cors from "cors";

const { authenticate, authorize } = authMiddleware

const router = express.Router()


router.post('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.createRoom)
router.get('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.getRoom)
router.get('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.getRoomById)


export default router;