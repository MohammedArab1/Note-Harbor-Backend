import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
	tagName: {
		type: String,
		required: true,
	},
	notes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
		required: false,
		default: [],
	}],
	colour: {
		type: String,
		required: true,
	},
});

export const Tag = mongoose.model('Tag', TagSchema);
