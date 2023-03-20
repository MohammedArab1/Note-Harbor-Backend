import express from 'express'
import { createGroup, findGroupsPerUserId } from '../controllers/GroupController.js'

const GroupRouter = express.Router()

GroupRouter.post('/', async (req, res) => {
  await createGroup(req,res)
})

GroupRouter.get('/:id', async (req, res) => {
  await findGroupsPerUserId(req,res,req.params.id)
})

export default GroupRouter