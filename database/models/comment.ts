import mongoose, { Types } from 'mongoose';
import { IComment } from '../../types.js';

const CommentSchema = new mongoose.Schema<IComment>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	inReplyTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment',
	},
	dateCreated: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateUpdated: {
		type: Date,
	},
	note: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		required: true,
	},
});

export const Comment = mongoose.model('Comment', CommentSchema);
