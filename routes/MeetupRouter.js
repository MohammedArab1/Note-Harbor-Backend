import express from 'express'
import { createMeetup, deleteMeetup, getMeetupByGroupId } from '../controllers/MeetupController.js'


const MeetupRouter = express.Router()

MeetupRouter.post('/', async (req, res, next) => {
  try {
    await createMeetup(req,res)
  } catch (error) {
    next(error);
  }
  })

MeetupRouter.delete('/:meetupId', async (req, res, next) => {
  try {
    await deleteMeetup(req,res)
  } catch (error) {
    next(error);
  }
})

MeetupRouter.get('/:groupId', async (req, res, next) => {
  try {
    await getMeetupByGroupId(req,res)
  } catch (error) {
    next(error);
  }
})

export default MeetupRouter