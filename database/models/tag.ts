import mongoose, { Types } from 'mongoose';
import { ITag } from '../../types.js';

const TagSchema = new mongoose.Schema<ITag>({
	_id:{
		type:String,
	},
	project: {
		type:String,
		required: true
	},
	tagName: {
		type: String,
		required: true,
	},
	notes: [{
		type: String,
		default: [],
	}],
	colour: {
		type: String,
		required: true,
	},
});

export const Tag = mongoose.model('Tag', TagSchema);
