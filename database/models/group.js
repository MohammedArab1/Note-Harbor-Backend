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
    unique: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  meetups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meetup',
    }
  ],
  defaultOptions: {
    type:Array
  }
});


GroupSchema.pre('save', async function (next) {
  if (this.isNew) {
    this._oldMembers = [];
  } else {
    const oldGroup = await this.constructor.findById(this._id);
    this._oldMembers = oldGroup.members;
  }
  next();
});

GroupSchema.post('save', async function (doc, next) {
  const User = mongoose.model('User');
  
  // Users who joined the group
  const usersJoined = this.members.filter(m => !this._oldMembers.includes(m));
  // Users who left the group
  const usersLeft = this._oldMembers.filter(m => !this.members.includes(m));

  if (usersJoined.length > 0) {
    await User.updateMany(
      { _id: { $in: usersJoined } },
      { $addToSet: { groups: this._id } }
    );
  }

  if (usersLeft.length > 0) {
    await User.updateMany(
      { _id: { $in: usersLeft } },
      { $pull: { groups: this._id } }
    );
  }

  next();
});


export const Group = mongoose.model("Group", GroupSchema);
