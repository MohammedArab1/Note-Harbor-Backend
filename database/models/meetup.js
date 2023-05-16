import mongoose from "mongoose"

const minPplNeededSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

const MeetupSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  deadLine: {
    type: Date,
    required: true
  },
  meetupDate: {
    type: Date,
  },
  membersResponded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  active:{
    type: Boolean,
    required: true
  },
  creationDate: {
    type: Date,
    required: true
  },
  location:{
    type: String,
  },
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }
  ],
  dateToPickFrom: {type:Date,required:true}, // everybody has to pick within this particular window of dates (from)
  dateToPickTo: {type:Date,required:true}, // everybody has to pick within this particular window of dates (to)
  minPplNeeded: minPplNeededSchema, //the minimum number of people needed before a meeting can be established
  numOfDatesToPick:{type:Number,required:true}, // How many dates a member can choose 
  // minimumNotice:{type:Number,required:true}, // How many days in advance enough members have to respond, otherwise the meeting is cancelled (Realized it's same as deadline)

});


export const Meetup = mongoose.model("Meetup", MeetupSchema);
