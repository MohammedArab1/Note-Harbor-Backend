import express from 'express'
import { User } from '../database/models/user.js'
import { createUser } from '../controllers/UserController.js'

const UserRouter = express.Router()

UserRouter.post('/register', async (req, res,next) => {
  try {
    await createUser(req,res)
  } catch (error) {
    next(error);
  }
  })

UserRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.status(201).json(users)
  } catch (error) {
    next(error);
  }
})


export default UserRouter