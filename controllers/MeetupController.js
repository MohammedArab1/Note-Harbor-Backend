import bcrypt from "bcrypt"
import { Meetup } from "../database/models/meetup.js";


export const createMeetup = async (req,res) => {
    const { group,deadLine,location,name,description,dateToPickFrom,dateToPickTo,minPplNeeded,numOfDatesToPick } = req.body;
    const active = true
    const creationDate = Date.now()
    const meetup = new Meetup({group,deadLine,active,creationDate,location,name,description,dateToPickFrom,dateToPickTo,minPplNeeded,numOfDatesToPick})
    await meetup.save()
    res.status(201).json(meetup)
}
