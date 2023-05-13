import express from 'express'
import { createMeetup } from '../controllers/MeetupController.js'


const MeetupRouter = express.Router()

MeetupRouter.post('/', async (req, res) => {
  await createMeetup(req,res)
})

export default MeetupRouter