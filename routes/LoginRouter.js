import express from 'express'
import { login } from '../controllers/LoginController.js'


const LoginRouter = express.Router()

LoginRouter.post('/', async (req, res, next) => {
  try {
    await login(req,res)
  } catch (error) {
    next(error);
  }
})

export default LoginRouter