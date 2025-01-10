import mongoose, { Types } from 'mongoose';
import { ITag } from '../../types.js';

const TagSchema = new mongoose.Schema<ITag>({
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	},
	tagName: {
		type: String,
		required: true,
	},
	notes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		default: [],
	}],
	colour: {
		type: String,
		required: true,
	},
});

export const Tag = mongoose.model('Tag', TagSchema);
