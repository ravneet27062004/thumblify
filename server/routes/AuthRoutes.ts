import express from 'express'
import { loginUser, logoutUser, registerUser ,verifyUser} from '../controllers/auth'
import protect from '../middlwears/auth'

const AuthRouter=express.Router()

AuthRouter.post('/register',registerUser)
AuthRouter.post('/login',loginUser)
AuthRouter.get('/verify',protect,verifyUser)
AuthRouter.post('/logout',protect,logoutUser)

export default AuthRouter;