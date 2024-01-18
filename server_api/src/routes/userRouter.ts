import express from 'express'
import {
  loginValidation,
  registrValidation,
} from '../validators/userInfoValidator'
import {
  getMe,
  userLogin,
  userRegistration,
} from '../controllers/userController'
import { checkSession } from '../middleware/checkers'

const userRouter = express.Router()

userRouter.post('/registration', registrValidation, userRegistration)
userRouter.post('/login', loginValidation, userLogin)
userRouter.get('/me', checkSession, getMe)

export default userRouter
