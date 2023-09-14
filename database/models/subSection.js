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
});


export const SubSection = mongoose.model("SubSection", SubSectionSchema);
