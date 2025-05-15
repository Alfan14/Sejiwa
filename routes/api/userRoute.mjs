import express from 'express';
import db from '../../controllers/userController.mjs';
import  authMiddleware from '../../middlewares/authMiddleware.mjs';

const { authenticate, authorize } = authMiddleware

const router = express.Router()

router.get('/users', authenticate, authorize(['admin']),db.getUsers)
router.get('/users/:id', authenticate, authorize(['admin']),db.getUserById)
router.post('/users', authenticate, authorize(['admin']),db.createUser)
router.put('/users/:id', authenticate, authorize(['admin']),db.updateUser)
router.delete('/users/:id', authenticate, authorize(['admin']),db.deleteUser)

export default router;