import express from 'express'
import { User } from '../database/models/User.js'
import { createUser } from '../controllers/UserController.js'

const UserRouter = express.Router()

UserRouter.post('/register', async (req, res) => {
  await createUser(req,res)
})

export default UserRouter