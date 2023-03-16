import express from 'express'
import { login } from '../controllers/LoginController.js'
const LoginRouter = express.Router()

LoginRouter.post('/', async (req, res) => {
  await login(req,res)
})

export default LoginRouter