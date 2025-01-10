import mongoose, { Types } from 'mongoose';
import { ISubSection } from '../../types.js';

const SubSectionSchema = new mongoose.Schema<ISubSection>({
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
