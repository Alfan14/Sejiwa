import express from 'express';
import db_room from '../../controllers/chatsController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';
import cors from "cors";


const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.use(cors({
  origin: ['http://localhost:3000', 'https://sejiwa-frontend.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

router.options('*', cors());

router.post('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.createRoom)
router.get('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.getRoom)
router.get('/chats/rooms', authenticate, authorize(['pelajar','konselor']),db_room.getRoomById)


export default router;