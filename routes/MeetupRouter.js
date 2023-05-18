import express from 'express'
import { createMeetup, deleteMeetup, getMeetupByGroupId } from '../controllers/MeetupController.js'


const MeetupRouter = express.Router()

MeetupRouter.post('/', async (req, res) => {
  await createMeetup(req,res)
})

MeetupRouter.delete('/:meetupId', async (req, res) => {
  await deleteMeetup(req,res)
})

MeetupRouter.get('/:groupId', async (req, res, next) => {
  await getMeetupByGroupId(req,res, next)
})

export default MeetupRouter