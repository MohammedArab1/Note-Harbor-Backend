import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  inReplyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
});


export const Comment = mongoose.model("Comment", CommentSchema);
