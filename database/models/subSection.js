import mongoose from "mongoose"

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
  notes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		required: false,
		default: [],
	}]
});


export const SubSection = mongoose.model("SubSection", SubSectionSchema);
