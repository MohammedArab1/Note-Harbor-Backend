import mongoose, { Types } from 'mongoose';

export interface ISubSection {
	_id: Types.ObjectId
	project: Types.ObjectId;
	notes: Types.ObjectId[];
	description?: string;
  }
const SubSectionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
  },
});


export const SubSection = mongoose.model("SubSection", SubSectionSchema);
