import express from 'express'
import { loginUser, logoutUser, registerUser ,verifyUser} from '../controllers/auth'
import protect from '../middlwears/auth'
import { loginLimiter, logoutLimiter, registerLimiter } from '../middlwears/rateLimiter'

const AuthRouter=express.Router()

AuthRouter.post('/register', registerLimiter, registerUser)
AuthRouter.post('/login',loginLimiter , loginUser)
AuthRouter.get('/verify',protect,verifyUser)
AuthRouter.post('/logout',protect,logoutLimiter ,  logoutUser)

export default AuthRouter;