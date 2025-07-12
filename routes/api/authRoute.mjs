//importing modules
import express from 'express';
import authController from '../../controllers/authController.mjs';
import userAuth from '../../middlewares/userAuth.mjs';

const { register, login , refreshtoken} = authController

const router = express.Router()

// signup endpoint
router.post('/signup', userAuth.saveUser, register)

//login endpoint
router.post('/login', login )

// refresh token endpoint
router.post('/refresh', refreshtoken )


export default router