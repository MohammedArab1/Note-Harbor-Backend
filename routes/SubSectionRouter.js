import express from 'express'
import { createSubSection, deleteSubSection, getSubSectionByProjectId } from '../controllers/SubSectionController.js'


const SubSectionRouter = express.Router()

SubSectionRouter.post('/', async (req, res, next) => {
  try {
    await createSubSection(req,res)
  } catch (error) {
    next(error);
  }
  })

SubSectionRouter.delete('/:meetupId', async (req, res, next) => {
  try {
    await deleteSubSection(req,res)
  } catch (error) {
    next(error);
  }
})

SubSectionRouter.get('/:groupId', async (req, res, next) => {
  try {
    await getSubSectionByProjectId(req,res)
  } catch (error) {
    next(error);
  }
})

export default SubSectionRouter