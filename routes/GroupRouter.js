import express from 'express'
import { createGroup, findGroupsPerUserId, addMemberToGroup, findGroupById, deleteGroup, updateGroup } from '../controllers/GroupController.js'

const GroupRouter = express.Router()

GroupRouter.post('/', async (req, res,next) => {
  try{
    await createGroup(req,res)
  } catch (error) {
    next(error);
  }
})

GroupRouter.get('/', async (req, res, next) => {
  try {
    await findGroupsPerUserId(req,res)
  } catch (error) {
    next(error);
  }
})

GroupRouter.get('/:groupId', async (req, res, next) => {
  try {
    await findGroupById(req,res)
  } catch (error) {
    next(error);
  }
})

GroupRouter.put('/', async (req, res) => {
  await addMemberToGroup(req,res)
})

GroupRouter.delete('/:groupId', async (req, res) => {
  await deleteGroup(req,res)
})

GroupRouter.put('/:groupId', async (req, res) => {
  await updateGroup(req,res)
})


export default GroupRouter