import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commentValue: {
    type: String,
    required: true
  }
});


export const Comment = mongoose.model("Comment", CommentSchema);
