//importing modules
import express from 'express';
import authController from '../../controllers/authController.mjs';
import userAuth from '../../middlewares/userAuth.mjs';

const { register, login , refreshAccessToken} = authController

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, register)

//login route
router.post('/login', login )

router.post('/refresh', refreshAccessToken )


export default router