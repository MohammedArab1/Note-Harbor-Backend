import express from 'express'
import { createGroup, findGroupsPerUserId, addMemberToGroup, findGroupById, deleteGroup } from '../controllers/GroupController.js'

const GroupRouter = express.Router()

GroupRouter.post('/', async (req, res) => {
  await createGroup(req,res)
})

GroupRouter.get('/', async (req, res) => {
  await findGroupsPerUserId(req,res)
})

GroupRouter.get('/:groupId', async (req, res) => {
  await findGroupById(req,res)
})

GroupRouter.put('/', async (req, res) => {
  await addMemberToGroup(req,res)
})

GroupRouter.delete('/:groupId', async (req, res) => {
  await deleteGroup(req,res)
})


export default GroupRouter