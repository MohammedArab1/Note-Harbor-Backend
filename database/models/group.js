import mongoose from "mongoose"

const GroupSchema = new mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  active: { 
    type: Boolean, 
    required: true
  },
  lastInitiationDate: { 
    type: Date, 
    required: true
  },
  accessCode: {
    type: String,
    required: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupName: {
    type: String,
    required: true,
  }
});


export const Group = mongoose.model("Group", GroupSchema);
