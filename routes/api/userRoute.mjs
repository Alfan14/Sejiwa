//importing modules
import express from 'express';
import userController from '../../controllers/userController.mjs';
import userAuth from '../../middlewares/userAuth.mjs';

const { register, login } = userController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, register)

//login route
router.post('/login', login )

export default router