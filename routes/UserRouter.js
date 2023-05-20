import express from 'express'
import { User } from '../database/models/user.js'
import { createUser } from '../controllers/UserController.js'

const UserRouter = express.Router()

UserRouter.post('/register', async (req, res) => {
  await createUser(req,res)
})

UserRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.status(201).json(users)
})


export default UserRouter