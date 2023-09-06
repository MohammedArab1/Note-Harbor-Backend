import express from 'express'
import { createProject, findProjectsPerUserId, addMemberToProject, findProjectById, deleteProject, updateProject } from '../controllers/ProjectController.js'

const ProjectRouter = express.Router()

ProjectRouter.post('/', async (req, res,next) => {
  try{
    await createProject(req,res)
  } catch (error) {
    next(error);
  }
})

ProjectRouter.get('/', async (req, res, next) => {
  try {
    await findProjectsPerUserId(req,res)
  } catch (error) {
    next(error);
  }
})

ProjectRouter.get('/:groupId', async (req, res, next) => {
  try {
    await findProjectById(req,res)
  } catch (error) {
    next(error);
  }
})

ProjectRouter.put('/', async (req, res) => {
  await addMemberToProject(req,res)
})

ProjectRouter.delete('/:groupId', async (req, res) => {
  await deleteProject(req,res)
})

ProjectRouter.put('/:groupId', async (req, res) => {
  await updateProject(req,res)
})


export default ProjectRouter