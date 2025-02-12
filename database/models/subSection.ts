import mongoose, { Types } from 'mongoose';
import { ISubSection } from '../../types.js';

const SubSectionSchema = new mongoose.Schema<ISubSection>({
  _id:{
		type:String,
	},
  project: {
    type:String,
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
