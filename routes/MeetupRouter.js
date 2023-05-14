import express from 'express'
import { createMeetup, deleteMeetup } from '../controllers/MeetupController.js'


const MeetupRouter = express.Router()

MeetupRouter.post('/', async (req, res) => {
  await createMeetup(req,res)
})

MeetupRouter.delete('/:meetupId', async (req, res) => {
  await deleteMeetup(req,res)
})

export default MeetupRouter