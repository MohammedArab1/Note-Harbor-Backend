import express from 'express'
import { createGroup, findGroupsPerUserId, addMemberToGroup } from '../controllers/GroupController.js'

const GroupRouter = express.Router()

GroupRouter.post('/', async (req, res) => {
  await createGroup(req,res)
})

GroupRouter.get('/', async (req, res) => {
  await findGroupsPerUserId(req,res)
})

GroupRouter.put('/', async (req, res) => {
  await addMemberToGroup(req,res)
})


export default GroupRouter