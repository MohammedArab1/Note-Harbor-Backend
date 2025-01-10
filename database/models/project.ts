import mongoose, { Types } from 'mongoose';
import { IProject } from '../../types.js';

const ProjectSchema = new mongoose.Schema<IProject>({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  creationDate: { 
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
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  private: { 
    type: Boolean, 
    required: true
  },
});


ProjectSchema.pre('save', async function (this:any,next) {
  const thisMembers = this.members;
  const oldProjectMembers = await this.constructor.findById(this._id).members;
  if (this.isNew) {
    this._oldMembers = [];
  } else {
    const oldProject = await this.constructor.findById(this._id);
    this._oldMembers = oldProject.members;
  }
  next();
});

ProjectSchema.post('save', async function (this:any,doc, next) {
  const User = mongoose.model('User');
  
  // Users who joined the project
  const usersJoined = this.members.filter((m:any) => !this._oldMembers.includes(m));
  // Users who left the project
  const usersLeft = this._oldMembers.filter((m:any) => !this.members.includes(m));

  if (usersJoined.length > 0) {
    await User.updateMany(
      { _id: { $in: usersJoined } },
      { $addToSet: { projects: this._id } }
    );
  }

  if (usersLeft.length > 0) {
    await User.updateMany(
      { _id: { $in: usersLeft } },
      { $pull: { projects: this._id } }
    );
  }

  next();
});


export const Project = mongoose.model("Project", ProjectSchema);
