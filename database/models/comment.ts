import mongoose, { Types } from 'mongoose';
import { IComment } from '../../types.js';

const CommentSchema = new mongoose.Schema<IComment>({
	_id:{
		type:String,
	},
	user: {
		type:String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	inReplyTo: {
		type:String,
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
		type:String,
		required: true,
	},
});

export const Comment = mongoose.model('Comment', CommentSchema);
